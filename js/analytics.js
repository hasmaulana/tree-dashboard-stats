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

        // Normalize Member API data structure first to make sure member is always populated
        data.forEach(item => {
            if (item && !item.member && item.username) {
                item.member = {
                    member_id: item.member_id,
                    username: item.username,
                    photo: item.photo,
                    creator_status: item.creator_status,
                    is_official: item.is_official,
                    is_followed: item.is_followed
                };
            }
        });

        // Determine if it's Member API data
        const isMemberApi = (window.loadedSyncMeta && window.loadedSyncMeta.request_params && window.loadedSyncMeta.request_params.sync_source === 'member') ||
                            (data.length > 0 && data.some(item => item.tag && item.tag.name)) &&
                            (new Set(data.map(item => item.member && item.member.username).filter(Boolean)).size <= 1);

        return {
            summary: this.getSummaryStats(data, isMemberApi),
            dailyActivity: this.getDailyActivity(data),
            topUsers: this.getTopUsers(data, 10, isMemberApi),
            contentType: this.getContentTypeDist(data),
            engagement: this.getEngagementStats(data),
        };
    },

    getSummaryStats(data, isMemberApi = false) {
        const totalPosts = data.length;

        // Members or Tags count
        let totalMembers;
        if (isMemberApi) {
            const uniqueLocations = new Set(data.map(item => item.tag && item.tag.name).filter(Boolean));
            totalMembers = uniqueLocations.size;
        } else {
            const uniqueMembers = new Set(data.map(item => item.member && item.member.username).filter(Boolean));
            totalMembers = uniqueMembers.size;
        }

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

    getTopUsers(data, limit = 10, isMemberApi = false) {
        const userMap = {};

        data.forEach(item => {
            let key;
            let avatar = null;
            let status = 'regular';

            if (isMemberApi) {
                key = (item.tag && item.tag.name) || 'Unknown Tag';
                avatar = (item.tag && item.tag.icon) || null;
                status = 'Tag';
            } else {
                key = item.member ? item.member.username : 'Unknown';
                avatar = item.member ? item.member.photo : null;
                status = item.member ? item.member.creator_status : 'regular';
            }

            if (!userMap[key]) {
                userMap[key] = {
                    username: key, // Keep key name as username so UI works out of the box
                    avatar,
                    status,
                    count: 0,
                    likes: 0
                };
            }
            userMap[key].count += 1;
            userMap[key].likes += (item.likes_count || 0);
        });

        const sorted = Object.values(userMap).sort((a, b) => b.count - a.count);

        if (limit === 0) return sorted; // Return all
        return sorted.slice(0, limit);
    },

    getMemberDetails(data, username, isMemberApi = false) {
        let posts;
        let memberInfo;

        if (isMemberApi) {
            posts = data.filter(item => {
                const loc = (item.tag && item.tag.name) || 'Unknown Tag';
                return loc === username;
            });
            if (posts.length === 0) return null;
            memberInfo = {
                username,
                photo: (posts[0].tag && posts[0].tag.icon) || null,
                creator_status: 'Tag'
            };
        } else {
            posts = data.filter(item => item.member && item.member.username === username);
            if (posts.length === 0) return null;
            memberInfo = posts[0].member;
        }

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
