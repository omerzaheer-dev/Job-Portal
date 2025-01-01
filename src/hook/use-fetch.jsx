import { useState } from 'react';
import { useSession } from '@clerk/clerk-react';
import { getJobs } from '@/api/apiJobs';

export const useFetch = (cb, options) => {
    const { isLoaded, session, isSignedIn } = useSession();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // if (!isLoaded || !isSignedIn) return;
    const fn = async (...args) => {
        setLoading(true)
        try {
            const accessToken = await session.getToken({ template: "supabase" });
            const data = await cb(accessToken, options, ...args);
            setData(data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching jobs:", err);
            setError(err.message);
            setLoading(false);
        }
    };
    return { data, loading, error, fn };
};
