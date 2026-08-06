const fs = require('fs');
let content = fs.readFileSync('firebase.ts', 'utf8');

const oldUpload = `export const uploadLeaderboardStats = async (
    userId: string,
    mode: string,
    category: string,
    score: number,
    artistName: string,
    itemName: string,
    imageUrl: string
) => {
    try {
        const docId = \`\${userId}_\${mode}_\${category}\`;
        await setDoc(doc(db, 'leaderboard', docId), {
            userId,
            mode,
            category,
            score,
            artistName,
            itemName,
            imageUrl: imageUrl.length > 2000 ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(artistName) + "&background=random" : imageUrl,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error uploading leaderboard stat:", error);
    }
};

export const getLeaderboard = async (mode: string, category: string) => {
    try {
        const q = query(
            collection(db, 'leaderboard'),
            where("mode", "==", mode),
            where("category", "==", category),
            orderBy("score", "desc"),
            limit(50)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};`;

const newUpload = `export const uploadLeaderboardStats = async (
    userId: string,
    mode: string,
    category: string,
    score: number,
    artistName: string,
    itemName: string,
    imageUrl: string
) => {
    try {
        await setDoc(doc(db, \`leaderboards_\${mode}_\${category}\`, userId), {
            userId,
            score,
            artistName,
            itemName,
            imageUrl: imageUrl.length > 2000 ? "https://ui-avatars.com/api/?name=" + encodeURIComponent(artistName) + "&background=random" : imageUrl,
            updatedAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        console.error("Error uploading leaderboard stat:", error);
    }
};

export const getLeaderboard = async (mode: string, category: string) => {
    try {
        const q = query(
            collection(db, \`leaderboards_\${mode}_\${category}\`),
            orderBy("score", "desc"),
            limit(50)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching leaderboard:", error);
        return [];
    }
};`;

if(content.includes(oldUpload)) {
    content = content.replace(oldUpload, newUpload);
    fs.writeFileSync('firebase.ts', content);
    console.log("Success");
} else {
    console.log("Not found");
}

