import { useState, useEffect, useRef } from 'react';

interface FocusSession {
  task: string;
  durationMinutes: number;
  promptMinutes: number;
}

export const useFocusManager = () => {
  const [session, setSession] = useState<FocusSession | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); 
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [breakTimeLeft, setBreakTimeLeft] = useState<number>(0);
  
  const timerRef = useRef<number | null>(null);
  const lastPromptTimeRef = useRef<number>(0);

  const sendNotification = (title: string, body: string) => {
    console.log(`[Notification Engine] Attempting: ${title} | Body: ${body}`);
    if (Notification.permission === "granted") {
      try {
        new Notification(title, { body });
        console.log(`[Notification Engine] Success: ${title}`);
      } catch (err) {
        console.error(`[Notification Engine] Error showing notification:`, err);
      }
    } else {
      console.warn(`[Notification Engine] Blocked: Permission is ${Notification.permission}`);
    }
  };

  const startSession = (durationMinutes: number, promptMinutes: number, task: string) => {
    console.log("Starting session:", { durationMinutes, promptMinutes, task });
    
    // Trigger notification IMMEDIATELY within the click stack to avoid "User Gesture" expiry
    if (Notification.permission === "granted") {
      sendNotification("Focus Started", "Your timer has begun. Stay focused!");
    } else {
      // Re-request permission for next time, but we can't show it NOW without immediate permission
      Notification.requestPermission();
    }
    
    setSession({ task, durationMinutes, promptMinutes });
    const totalSeconds = durationMinutes * 60;
    setTimeLeft(totalSeconds);
    lastPromptTimeRef.current = totalSeconds;
    setIsRunning(true);
  };

  const stopSession = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSession(null);
    setTimeLeft(0);
    setBreakTimeLeft(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startBreak = (durationMinutes: number) => {
    if (!isRunning) return;
    setIsBreak(true);
    setBreakTimeLeft(durationMinutes * 60);
    sendNotification("Break Started", `Take a quick ${durationMinutes}m breather!`);
  };

  const endBreak = () => {
    setIsBreak(false);
    setBreakTimeLeft(0);
    sendNotification("Break Ended", "Time to get back to work! Your timer is resuming.");
  };

  // Timer loop
  useEffect(() => {
    if (!isRunning || !session) return;

    timerRef.current = window.setInterval(() => {
      // If we are currently in an active break
      if (isBreak) {
        setBreakTimeLeft((prev) => {
          if (prev <= 1) {
            endBreak(); // resume normal session immediately
            return 0;
          }
          return prev - 1;
        });
        return; // Don't tick down the focus timer
      }

      // Normal focus timer tick
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer finished!
          sendNotification(
            "Focus Session Complete!", 
            session.task ? `Great job focusing on: ${session.task}` : "Great job completing your focus session!"
          );
          
          setIsRunning(false);
          setSession(null);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }

        // Check interval for log prompts
        if (session.promptMinutes > 0) {
          const promptSeconds = session.promptMinutes * 60;
          // If the time passed since the last prompt is exactly or greater than the interval
          if (lastPromptTimeRef.current - prev >= promptSeconds) {
            sendNotification(
              "Time to Log!", 
              "Check in on your progress. What have you been working on?"
            );
            // reset the marker to the exact theoretical prompt time so it doesn't drift
            lastPromptTimeRef.current -= promptSeconds; 
          }
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, session]); // Dependency array ensures latest session is captured

  return {
    session,
    timeLeft,
    isRunning,
    isBreak,
    breakTimeLeft,
    startSession,
    stopSession,
    startBreak,
    endBreak
  };
};

export default useFocusManager;
