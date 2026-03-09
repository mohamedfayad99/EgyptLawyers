import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref and a boolean `visible` that becomes true once
 * the element enters the viewport. Used for scroll-triggered animations.
 */
export function useScrollAnimation(threshold = 0.15) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect(); // fire once
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold]);

    return { ref, visible };
}
