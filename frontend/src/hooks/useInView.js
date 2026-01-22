import { useState, useEffect, useRef } from 'react';

const useInView = (options = {}) => {
    const [isInView, setIsInView] = useState(false);
    const elementRef = useRef(null);
    const hasAnimated = useRef(false); // Track if animation has already run

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated.current) {
                setIsInView(true);
                hasAnimated.current = true; // Ensure it only runs once
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.2, // Trigger when 20% visible
            ...options
        });

        const currentElement = elementRef.current;
        if (currentElement) {
            observer.observe(currentElement);
        }

        return () => {
            if (currentElement) {
                observer.unobserve(currentElement);
            }
        };
    }, [options]);

    return [elementRef, isInView];
};

export default useInView;
