const fs = require('fs');

let content = fs.readFileSync('components/RedMicProUnlockView.tsx', 'utf8');

content = content.replace(
`    const faqs = [
        {
            question: "How much is Red Mic Pro?",
            answer: "One time payment of $10.99 USD."
        },
        {
            question: "What are all the features of Red Mic Pro?",
            answer: "Red Mic Pro unlocks an infinite hype cap, limitless music video shoots, access to premium analytics to track your rise to stardom, and removes all limits on playlist generation."
        },
        {
            question: "Why does it cost that much?",
            answer: "This is a one-time purchase that supports server costs, ongoing future updates, and keeps the entire game experience completely ad-free and uninterrupted for you."
        }
    ];`,
`    const faqs = [
        {
            question: "How much is Red Mic Pro?",
            answer: "A monthly subscription of $14.99USD."
        },
        {
            question: "What are all the features of Red Mic Pro?",
            answer: "Red Mic Pro unlocks an infinite hype cap, limitless music video shoots, access to premium analytics to track your rise to stardom, removes all limits on playlist generation, includes the YouTube Music streaming platform, and provides a custom Red Mic Pro Dashboard with a song quality editor, custom feature builder, NPC user editor, and custom award show builder."
        },
        {
            question: "Why does it cost that much?",
            answer: "It helps support a solo developer. Because Red Mic Pro was recently pirated, it's now a monthly subscription. The code is deactivated after cancelling or failed renewal."
        }
    ];`
);

content = content.replace(
`<h3 className="text-xl font-bold">Unlock with Patreon</h3>
                                <p className="text-zinc-400 text-sm mt-1">If you are subscribed to any Red Mic Pro tier, login to unlock.</p>
                                <button onClick={handlePatreonLogin} className="w-full mt-3 bg-[#FF424D] hover:bg-[#e03b44] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 569 546" xmlns="http://www.w3.org/2000/svg"><g><circle cx="362.589996" cy="204.589996" r="204.589996"></circle><rect height="545.799988" width="100" x="0" y="0"></rect></g></svg>
                                    Login with Patreon
                                </button>`,
`<h3 className="text-xl font-bold">Subscribe on Patreon</h3>
                                <p className="text-zinc-400 text-sm mt-1">Subscribe on Patreon to receive an exclusive red mic pro code.</p>
                                <button onClick={handlePatreonLogin} className="w-full mt-3 bg-[#FF424D] hover:bg-[#e03b44] text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 569 546" xmlns="http://www.w3.org/2000/svg"><g><circle cx="362.589996" cy="204.589996" r="204.589996"></circle><rect height="545.799988" width="100" x="0" y="0"></rect></g></svg>
                                    Subscribe on Patreon
                                </button>`
);

fs.writeFileSync('components/RedMicProUnlockView.tsx', content);
