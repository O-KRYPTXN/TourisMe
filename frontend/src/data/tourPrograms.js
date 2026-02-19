// Luxor-specific tour programs offered by tourism companies
// We serve as the middleman and offer discounts

export const tourPrograms = [
    {
        id: 'lx1',
        name: 'Luxor Ancient Wonders - 3 Days',
        company: 'Nile Valley Tours',
        companyRating: 4.9,
        image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800',
        duration: '3 Days / 2 Nights',
        price: 450,
        originalPrice: 550,
        discount: 18,
        rating: 4.8,
        reviews: 234,
        groupSize: 'Up to 15 people',
        difficulty: 'Easy',
        category: 'Cultural',
        description: 'Explore the magnificent temples and tombs of ancient Luxor with expert guides. This comprehensive tour covers all major sites including Karnak Temple, Valley of the Kings, and more.',
        highlights: [
            'Karnak Temple Complex guided tour',
            'Valley of the Kings (3 tombs)',
            'Hatshepsut Temple visit',
            'Luxor Temple at sunset',
            'Traditional felucca sail on the Nile',
            'Colossi of Memnon photo stop',
        ],
        included: [
            '2 nights accommodation in 4-star hotel',
            'Daily breakfast and 2 dinners',
            'All entrance fees and tickets',
            'Professional Egyptologist guide',
            'Private air-conditioned transportation',
            'Felucca boat ride',
            'Hotel pick-up and drop-off',
        ],
        notIncluded: [
            'International flights',
            'Lunches',
            'Personal expenses',
            'Tips and gratuities',
            'Travel insurance',
        ],
        itinerary: [
            {
                day: 1,
                title: 'East Bank Exploration',
                description: 'Arrive in Luxor and check into your hotel. After lunch, visit the magnificent Karnak Temple Complex, one of the largest religious buildings ever constructed. In the evening, explore Luxor Temple illuminated beautifully at sunset. Enjoy a welcome dinner at a local restaurant with Nile views.',
            },
            {
                day: 2,
                title: 'West Bank Wonders',
                description: 'Cross to the West Bank and explore the Valley of the Kings, visiting three spectacular royal tombs. Continue to the stunning mortuary Temple of Hatshepsut, carved into the mountainside. Stop at the Colossi of Memnon for photos. In the afternoon, enjoy a traditional felucca sailing experience on the Nile. Dinner at hotel.',
            },
            {
                day: 3,
                title: 'Optional Activities & Departure',
                description: 'Optional hot air balloon ride at sunrise (additional cost). Morning free for shopping at local bazaars or relaxing. Check out and transfer to your next destination or airport. Tour ends with unforgettable memories of ancient Luxor.',
            },
        ],
    },
    {
        id: 'lx2',
        name: 'Luxor Hot Air Balloon & Temples - 2 Days',
        company: 'Pharaoh Adventures',
        companyRating: 4.7,
        image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800',
        duration: '2 Days / 1 Night',
        price: 380,
        originalPrice: 450,
        discount: 16,
        rating: 4.9,
        reviews: 189,
        groupSize: 'Up to 12 people',
        difficulty: 'Easy',
        category: 'Adventure',
        description: 'Experience Luxor from the sky with a magical hot air balloon ride, then explore the most iconic temples. Perfect for travelers with limited time who want the complete Luxor experience.',
        highlights: [
            'Sunrise hot air balloon flight',
            'Aerial views of West Bank',
            'Karnak Temple exploration',
            'Valley of the Kings',
            'Luxor Temple',
            'Expert Egyptologist guide',
        ],
        included: [
            '1 night 4-star hotel accommodation',
            'Breakfast daily',
            'Hot air balloon ride with transfer',
            'All temple entrance fees',
            'Egyptologist tour guide',
            'Private A/C vehicle',
            'Welcome dinner',
        ],
        notIncluded: [
            'Flights to/from Luxor',
            'Lunch meals',
            'Additional tomb entries',
            'Shopping and souvenirs',
            'Tips for guides',
        ],
        itinerary: [
            {
                day: 1,
                title: 'Temple Tour Day',
                description: 'Meet your guide at Luxor International Airport or your hotel. Visit the massive Karnak Temple Complex, spending time exploring its hypostyle hall, obelisks, and sacred lake. After lunch, cross to the West Bank to visit the colorful Valley of the Kings and two royal tombs. End the day at Luxor Temple for sunset photos. Traditional Egyptian dinner included.',
            },
            {
                day: 2,
                title: 'Hot Air Balloon & Departure',
                description: 'Early morning pick-up for your hot air balloon adventure. Float peacefully over the West Bank at sunrise, enjoying breathtaking aerial views of temples, farms, and the Nile. After landing, enjoy breakfast and free time for last-minute shopping or relaxation before your departure.',
            },
        ],
    },
    {
        id: 'lx3',
        name: 'Luxor Full Experience - 5 Days',
        company: 'Ancient Egypt Tours',
        companyRating: 5.0,
        image: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800',
        duration: '5 Days / 4 Nights',
        price: 850,
        originalPrice: 1050,
        discount: 19,
        rating: 4.9,
        reviews: 312,
        groupSize: 'Up to 10 people',
        difficulty: 'Moderate',
        category: 'Cultural',
        description: 'The ultimate Luxor experience! This in-depth tour covers all major sites, hidden gems, and includes a Nile cruise, hot air balloon ride, and visits to local artisan workshops. Perfect for history enthusiasts.',
        highlights: [
            'Hot air balloon sunrise flight',
            'All major temples and tombs',
            '2-night Nile cruise',
            'Dendera and Abydos temples',
            'Artisan workshop visits',
            'Traditional Egyptian cooking class',
            'Luxor Museum',
        ],
        included: [
            '2 nights 5-star hotel',
            '2 nights Nile cruise (full board)',
            'All meals during cruise',
            'Breakfast daily at hotel',
            'All entrance fees',
            'Hot air balloon ride',
            'Expert Egyptologist guide',
            'Cooking class',
            'Private transportation',
        ],
        notIncluded: [
            'International airfare',
            'Beverages during meals',
            'Personal expenses',
            'Optional tomb entries (extra fee)',
            'Gratuities',
        ],
        itinerary: [
            {
                day: 1,
                title: 'Arrival & East Bank',
                description: 'Welcome to Luxor! Transfer to your 5-star hotel. After refreshing, visit Karnak Temple for a detailed exploration with your Egyptologist guide. Evening visit to Luxor Temple. Welcome dinner at a rooftop restaurant overlooking the Nile.',
            },
            {
                day: 2,
                title: 'West Bank Exploration',
                description: 'Early sunrise hot air balloon flight over the West Bank. After breakfast, explore the Valley of the Kings (4 tombs), Temple of Hatshepsut, Deir el-Medina workers village, and Valley of the Queens. Visit a local alabaster workshop. Dinner at hotel.',
            },
            {
                day: 3,
                title: 'Nile Cruise Begins - Dendera & Abydos',
                description: 'Check out and board your Nile cruise ship. Sail north to visit the stunning Dendera Temple Complex dedicated to Hathor, famous for its zodiac ceiling. Continue to Abydos to see the Temple of Seti I with its beautiful hieroglyphs. Return to ship for dinner and overnight sailing.',
            },
            {
                day: 4,
                title: 'Cruise Day & Cultural Activities',
                description: 'Relaxing day on the Nile. Participate in a traditional Egyptian cooking class on board. Visit Luxor Museum in the afternoon to see mummies and artifacts. Evening entertainment with Nubian music and dance show. Captain\'s dinner.',
            },
            {
                day: 5,
                title: 'Final Morning & Departure',
                description: 'Enjoy your final breakfast on the cruise. Free time for last-minute shopping at Luxor Souq. Visit a traditional papyrus workshop to see ancient art techniques. Transfer to airport or next destination. Tour concludes with comprehensive memories of Luxor.',
            },
        ],
    },
    {
        id: 'lx4',
        name: 'Luxor & Aswan Highlights - 4 Days',
        company: 'Nile Journey Co.',
        companyRating: 4.8,
        image: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800',
        duration: '4 Days / 3 Nights',
        price: 720,
        originalPrice: 880,
        discount: 18,
        rating: 4.7,
        reviews: 156,
        groupSize: 'Up to 14 people',
        difficulty: 'Easy',
        category: 'Cultural',
        description: 'Combine the best of Luxor with Aswan\'s beautiful Nubian culture. This tour includes major temples in both cities, a scenic train journey, and a traditional felucca sailing experience.',
        highlights: [
            'Luxor temples and Valley of the Kings',
            'Scenic train to Aswan',
            'Philae Temple by boat',
            'Aswan High Dam visit',
            'Nubian village tour',
            'Felucca sailing experience',
        ],
        included: [
            '3 nights hotel accommodation',
            'Daily breakfast',
            '2 dinners',
            'First-class train tickets',
            'All entrance fees',
            'Egyptologist guide',
            'Felucca sailing',
            'Private transfers',
        ],
        notIncluded: [
            'Flights',
            'Lunch meals',
            'Abu Simbel excursion',
            'Personal spending',
            'Tips',
        ],
        itinerary: [
            {
                day: 1,
                title: 'Luxor Highlights',
                description: 'Full day tour of Luxor\'s East and West Banks. Visit Valley of the Kings, Hatshepsut Temple, Karnak Temple, and Luxor Temple. Overnight in Luxor.',
            },
            {
                day: 2,
                title: 'Train to Aswan',
                description: 'Morning train journey to Aswan along the Nile. Check into hotel. Afternoon visit to Philae Temple on Agilkia Island by motorboat. Sunset felucca sailing. Dinner at Nubian restaurant.',
            },
            {
                day: 3,
                title: 'Aswan & Nubian Village',
                description: 'Visit the Aswan High Dam and Unfinished Obelisk. Traditional Nubian village visit with colorful houses and henna painting. Enjoy authentic Nubian hospitality and tea. Shopping at Aswan Souq.',
            },
            {
                day: 4,
                title: 'Departure',
                description: 'Optional Abu Simbel excursion (additional cost). Free time before transfer to airport. Tour ends.',
            },
        ],
    },
    {
        id: 'lx5',
        name: 'Luxor Romantic Getaway - 2 Days',
        company: 'Eternal Egypt',
        companyRating: 4.9,
        image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800',
        duration: '2 Days / 1 Night',
        price: 520,
        originalPrice: 650,
        discount: 20,
        rating: 5.0,
        reviews: 98,
        groupSize: 'Private couple',
        difficulty: 'Easy',
        category: 'Romantic',
        description: 'Perfect romantic escape for couples. Enjoy private tours of the most beautiful temples at quietest times, sunset felucca sailing, and candlelit dinner on the Nile.',
        highlights: [
            'Private couple tour',
            'Luxury hotel with Nile view',
            'Sunset temple visit',
            'Romantic felucca cruise',
            'Candlelit Nile dinner',
            'Couples spa treatment',
        ],
        included: [
            '1 night luxury hotel suite',
            'All meals',
            'Private Egyptologist guide',
            'All temple fees',
            'Private A/C vehicle',
            'Felucca with refreshments',
            'Candlelit dinner cruise',
            'Couples massage',
            'Flowers and champagne',
        ],
        notIncluded: [
            'Flights',
            'Hot air balloon (can add)',
            'Additional spa treatments',
            'Shopping',
        ],
        itinerary: [
            {
                day: 1,
                title: 'Romance in Ancient Luxor',
                description: 'Private pick-up from your hotel. Visit Karnak Temple during quieter morning hours. Luxury lunch with Nile views. Afternoon visit to Valley of the Kings (private guide). Sunset at Hatshepsut Temple. Private felucca sailing at golden hour with refreshments. Romantic candlelit dinner on a private Nile cruise. Return to luxury hotel.',
            },
            {
                day: 2,
                title: 'Relaxation & Farewell',
                description: 'Breakfast in room with Nile view. Couples spa treatment with traditional Egyptian oils. Free time by the pool. Optional shopping with guide. Farewell lunch. Transfer to departure point with beautiful memories.',
            },
        ],
    },
];

// Filtering functions
export const filterPrograms = ({
    allPrograms = tourPrograms,
    category,
    minPrice,
    maxPrice,
    searchQuery,
    company,
} = {}) => {
    return allPrograms.filter(program => {
        if (category && program.category !== category) return false;
        if (minPrice && program.price < minPrice) return false;
        if (maxPrice && program.price > maxPrice) return false;
        if (company && program.company !== company) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                program.name.toLowerCase().includes(query) ||
                program.description.toLowerCase().includes(query) ||
                program.company.toLowerCase().includes(query)
            );
        }
        return true;
    });
};

export const getProgramById = (id) => {
    return tourPrograms.find(program => program.id === id);
};

export const categories = [...new Set(tourPrograms.map(p => p.category))];
export const companies = [...new Set(tourPrograms.map(p => p.company))];
