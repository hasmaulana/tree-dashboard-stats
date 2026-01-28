/**
 * Analytics Processing Module
 */

const Analytics = {

    /**
     * Process raw data to generate all stats
     */
    process(data) {
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format. Expected an array.");
        }

        return {
            summary: this.getSummaryStats(data),
            dailyActivity: this.getDailyActivity(data),
            topUsers: this.getTopUsers(data),
            contentType: this.getContentTypeDist(data),
            engagement: this.getEngagementStats(data),
            // sortedData: [...data].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Default sort new to old
        };
    },

    getSummaryStats(data) {
        const totalPosts = data.length;

        // Members
        const uniqueMembers = new Set(data.map(item => item.member && item.member.username).filter(Boolean));
        const totalMembers = uniqueMembers.size;

        // Interactions
        const totalLikes = data.reduce((sum, item) => sum + (item.likes_count || 0), 0);
        const totalComments = data.reduce((sum, item) => sum + (item.comment_count || 0), 0);
        const totalInteractions = totalLikes + totalComments;

        const avgLikes = totalPosts > 0 ? (totalLikes / totalPosts).toFixed(1) : 0;

        return {
            totalPosts,
            totalMembers,
            totalInteractions,
            avgLikes
        };
    },

    getDailyActivity(data) {
        const activityMap = {};

        data.forEach(item => {
            if (!item.created_at) return;
            // Extract date part YYYY-MM-DD
            const date = item.created_at.split('T')[0];
            activityMap[date] = (activityMap[date] || 0) + 1;
        });

        // Convert key-value to { date, count } and sort
        return Object.entries(activityMap)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    },

    getTopUsers(data, limit = 10) {
        const userMap = {};

        data.forEach(item => {
            const username = item.member ? item.member.username : 'Unknown';
            const avatar = item.member ? item.member.photo : null;
            const status = item.member ? item.member.creator_status : 'regular';

            if (!userMap[username]) {
                userMap[username] = {
                    username,
                    avatar,
                    status,
                    count: 0,
                    likes: 0
                };
            }
            userMap[username].count += 1;
            userMap[username].likes += (item.likes_count || 0);
        });

        const sorted = Object.values(userMap).sort((a, b) => b.count - a.count);

        if (limit === 0) return sorted; // Return all
        return sorted.slice(0, limit);
    },

    getMemberDetails(data, username) {
        // Filter posts for this user
        const posts = data.filter(item => item.member && item.member.username === username);

        if (posts.length === 0) return null;

        const memberInfo = posts[0].member;
        const totalLikes = posts.reduce((sum, item) => sum + (item.likes_count || 0), 0);
        const totalComments = posts.reduce((sum, item) => sum + (item.comment_count || 0), 0);

        return {
            member: memberInfo,
            stats: {
                totalPosts: posts.length,
                totalLikes,
                totalComments,
                avgLikes: (totalLikes / posts.length).toFixed(1)
            },
            posts: posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        };
    },


    getContentTypeDist(data) {
        const typeMap = {};

        data.forEach(item => {
            const type = item.content_type || 'unknown';
            typeMap[type] = (typeMap[type] || 0) + 1;
        });

        return Object.entries(typeMap).map(([type, count]) => ({ type, count }));
    },

    getEngagementStats(data) {
        // Simple engagement scatter plot data? Or perhaps distribution of likes.
        // Let's do a distribution of likes (bins)
        // 0 likes, 1-10 likes, 10-50, 50+

        const distribution = {
            '0': 0,
            '1-10': 0,
            '11-50': 0,
            '50+': 0
        };

        data.forEach(item => {
            const likes = item.likes_count || 0;
            if (likes === 0) distribution['0']++;
            else if (likes <= 10) distribution['1-10']++;
            else if (likes <= 50) distribution['11-50']++;
            else distribution['50+']++;
        });

        return distribution;
    }

};
