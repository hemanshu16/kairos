import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './TimezoneSelector.module.css';

// Get a list of supported timezones
const allTimezones: string[] = (() => {
  try {
    return (Intl as any).supportedValuesOf('timeZone');
  } catch (e) {
    return [
      'UTC', 'Africa/Abidjan', 'America/New_York', 'America/Chicago', 'America/Denver',
      'America/Los_Angeles', 'Asia/Dubai', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney',
      'Europe/London', 'Europe/Paris', 'Asia/Kolkata'
    ];
  }
})();

// Formatter cache to prevent massive CPU overhead recreating Intl objects
const formatterCache = new Map<string, { offset: string; timeFormatter: Intl.DateTimeFormat | null }>();

function getFormatters(tz: string): { offset: string; timeFormatter: Intl.DateTimeFormat | null } {
  if (!formatterCache.has(tz)) {
    try {
      const now = new Date();
      // 1. Get offset string once (e.g. UTC+3)
      const offsetFormatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
      const tzPart = offsetFormatter.formatToParts(now).find(p => p.type === 'timeZoneName');
      const offsetStr = tzPart ? tzPart.value.replace('GMT', 'UTC') : 'UTC';

      // 2. Create reusable time formatter
      const timeFormatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false });
      
      formatterCache.set(tz, { offset: offsetStr, timeFormatter });
    } catch {
      formatterCache.set(tz, { offset: 'UTC', timeFormatter: null });
    }
  }
  return formatterCache.get(tz)!;
}

// Wrapper for UTC offset string
function getUtcOffsetString(tz: string): string {
  return getFormatters(tz).offset;
}

// Format local time to HH:MM using cached formatter
function getLocalTimeStr(tz: string, date: Date): string {
  const { timeFormatter } = getFormatters(tz);
  if (!timeFormatter) return '--:--';
  try {
    return timeFormatter.format(date);
  } catch(e) {
    return '--:--';
  }
}

interface GroupedTimezones {
  [region: string]: string[];
}

const TimezoneSelector: React.FC = () => {
  const { timezone, setTimezone } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [now, setNow] = useState(new Date());
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearch('');
    }
  }, [isOpen]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Keep an internal timer for the dropdown's live clock feed
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const grouped = useMemo(() => {
    const q = search.trim().toLowerCase();

    const filtered = q === ''
      ? allTimezones
      : allTimezones.filter(tz => {
          const label = tz.replace(/_/g, ' ').toLowerCase(); // "america/new york"
          const city = (tz.split('/').pop() || '').replace(/_/g, ' ').toLowerCase(); // "new york"
          const region = (tz.split('/')[0] || '').toLowerCase(); // "america"
          return label.includes(q) || city.includes(q) || region.includes(q);
        });

    const groups: GroupedTimezones = {};
    filtered.forEach((tz: string) => {
      const parts = tz.split('/');
      if (parts.length === 1) {
        if (!groups['OTHER']) groups['OTHER'] = [];
        groups['OTHER'].push(tz);
      } else {
        const region = parts[0].toUpperCase();
        if (!groups[region]) groups[region] = [];
        groups[region].push(tz);
      }
    });

    // Sort keys
    const sortedGroups: GroupedTimezones = {};
    Object.keys(groups).sort().forEach(key => {
      sortedGroups[key] = groups[key].sort();
    });
    return sortedGroups;
  }, [search]);

  const handleSelect = (tz: string) => {
    setTimezone(tz);
    setIsOpen(false);
  };

  const activeLabel = timezone === 'local' || !timezone || timezone === Intl.DateTimeFormat().resolvedOptions().timeZone
    ? 'Local Time'
    : timezone.split('/').pop()?.replace(/_/g, ' ') || 'Local Time';

  const totalResults = Object.values(grouped).reduce((acc, arr) => acc + arr.length, 0);

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button className={styles.trigger} onClick={() => setIsOpen(!isOpen)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span>{activeLabel} ▾</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown} onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles.searchBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
               <circle cx="11" cy="11" r="8" />
               <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search city or region..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Escape') setIsOpen(false);
              }}
            />
            {search && (
              <button
                className={styles.clearBtn}
                onClick={() => setSearch('')}
                tabIndex={-1}
              >×</button>
            )}
          </div>

          <div className={styles.list}>
            {/* Always show Local Time option when not searching */}
            {search === '' && (
              <div
                className={`${styles.item} ${styles.localItem} ${timezone === 'local' ? styles.selected : ''}`}
                onClick={() => handleSelect('local')}
              >
                <span className={`${styles.cityName} ${styles.localName}`}>Local Time</span>
                <div className={styles.timeInfo}>
                  <span className={styles.offset}>local</span>
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className={styles.noResults}>No locations found for "{search}"</div>
            )}

            {Object.entries(grouped).map(([region, tzs]) => (
              <React.Fragment key={region}>
                <div className={styles.groupHeader}>{region}</div>
                {tzs.map((tz: string) => {
                  const city = tz.split('/').pop()?.replace(/_/g, ' ') || tz;
                  return (
                    <div
                      key={tz}
                      className={`${styles.item} ${timezone === tz ? styles.selected : ''}`}
                      onClick={() => handleSelect(tz)}
                    >
                      <span className={styles.cityName}>{city}</span>
                      <div className={styles.timeInfo}>
                        <span className={styles.offset}>{getUtcOffsetString(tz)}</span>
                        <span className={styles.timeStr}>{getLocalTimeStr(tz, now)}</span>
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TimezoneSelector;
