import axios from 'axios';

const api = axios.create({
    baseURL:'https://backend-cohort-2-0-hftg.onrender.com',
    withCredentials:true
})

function buildMoodCandidates(mood) {
    const raw = String(mood || '').trim();
    const withoutEmoji = raw.replace(/[^a-zA-Z\s]/g, '').trim();
    const lower = withoutEmoji.toLowerCase();
    const title = lower ? lower.charAt(0).toUpperCase() + lower.slice(1) : '';

    return [...new Set([raw, withoutEmoji, lower, title].filter(Boolean))];
}

export const getEmotion = async(mood) => {
    try {
       const candidates = buildMoodCandidates(mood);

       for (const candidate of candidates) {
           const response = await api.get('/api/songs?mood=' + encodeURIComponent(candidate));
           const songs = response?.data?.songs;
           if (Array.isArray(songs) && songs.length > 0) {
               return response.data;
           }
       }

       const response = await api.get('/api/songs?mood=' + encodeURIComponent(candidates[0] || 'neutral'));
       return response.data;
    } catch (error) {
        console.error('Error fetching songs:',error);
        throw error;
    }
}
