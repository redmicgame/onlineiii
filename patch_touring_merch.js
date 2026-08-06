import fs from 'fs';
let code = fs.readFileSync('context/GameContext.tsx', 'utf8');

const target = `              if (tour.useVipPackages) {
                const vipTickets = Math.floor(newTicketsSold * 0.05); // 5% buy VIP
                revenue += vipTickets * (actualTicketPrice * 4); // VIP is an extra 4x
              }`;

const repl = `              if (tour.useVipPackages) {
                const vipTickets = Math.floor(newTicketsSold * 0.05); // 5% buy VIP
                revenue += vipTickets * (actualTicketPrice * 4); // VIP is an extra 4x
              }
              
              let merchRevenue = 0;
              if (tour.merchItems && tour.merchItems.length > 0) {
                 artistData.merch = artistData.merch.map(item => {
                    const isTourMerch = tour.merchItems?.find(m => m.id === item.id);
                    if (isTourMerch && item.stock > 0) {
                       const price = item.price;
                       const safePrice = Math.max(0.01, price);
                       // Tour attendees are very likely to buy merch (10-30% base, scaled by price)
                       let buyerRate = (0.1 + Math.random() * 0.2) * Math.min(1, 20 / safePrice);
                       buyerRate = Math.min(buyerRate, 0.4); // max 40%
                       let buyers = Math.floor(newTicketsSold * buyerRate);
                       buyers = Math.min(buyers, item.stock);
                       const itemRev = buyers * price;
                       merchRevenue += itemRev;
                       return { ...item, stock: item.stock - buyers, unitsSold: (item.unitsSold || 0) + buyers, _actualWeeklySales: (item._actualWeeklySales || 0) + buyers };
                    }
                    return item;
                 });
                 revenue += merchRevenue;
              }`;

code = code.replace(target, repl);
fs.writeFileSync('context/GameContext.tsx', code);
