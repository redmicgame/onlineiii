with open('context/GameContext.tsx', 'r') as f:
    content = f.read()

start_injection = """        const artistData = updatedArtistsData[artistId];
        const startingMoneyForWeek = artistData.money;"""

content = content.replace("        const artistData = updatedArtistsData[artistId];", start_injection, 1)

end_injection = """        artistData.inbox.push(...newEmails);

        const netEarned = artistData.money - startingMoneyForWeek;
        if (netEarned > 0) {
            artistData.yearlyIncome = (artistData.yearlyIncome || 0) + netEarned;
        }

        if (newDate.week === 50) {
            const taxRates = { Canada: 0.18, US: 0.15, UK: 0.21, Asia: 0.07, "Latin America": 0.09 };
            const loc = artistData.location || artistProfileForEmail?.country || "US";
            const rate = taxRates[loc as keyof typeof taxRates] || 0.15;
            const taxable = artistData.yearlyIncome || 0;
            const taxAmount = Math.floor(taxable * rate);
            
            if (taxAmount > 0) {
               artistData.money -= taxAmount;
               artistData.yearlyIncome = 0;
               artistData.inbox.push({
                   id: crypto.randomUUID(),
                   sender: "Government",
                   subject: "Annual Income Tax",
                   body: `Hello ${artistProfileForEmail?.name},\n\nBased on your location in ${loc}, your annual income tax rate is ${rate * 100}%.\n\nYour total taxable income this year was $${formatNumber(taxable)}.\n\nWe have deducted $${formatNumber(taxAmount)} from your account.\n\nRegards,\nThe Government`,
                   date: newDate,
                   isRead: false,
                   senderIcon: "default"
               });
            } else {
               artistData.yearlyIncome = 0;
            }
        }
      }
      // --- ATTRIBUTE FEATURE STREAMS TO FEATURED ARTISTS ---"""

content = content.replace("        artistData.inbox.push(...newEmails);\n      }\n      // --- ATTRIBUTE FEATURE STREAMS TO FEATURED ARTISTS ---", end_injection, 1)

with open('context/GameContext.tsx', 'w') as f:
    f.write(content)
