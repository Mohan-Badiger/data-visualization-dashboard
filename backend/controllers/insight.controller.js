const Insight = require('../models/Insight.model');

// @desc    Get all insights with filters
// @route   GET /api/insights
// @access  Public
exports.getInsights = async (req, res) => {
    try {
        const {
            end_year,
            topic,
            sector,
            region,
            pestle,
            source,
            swot,
            country,
            city,
            limit
        } = req.query;

        let query = {};

        // Helper to add filter if valid
        const addFilter = (field, value, isExact = false) => {
            // Strictly check for null, undefined, "All", and empty string
            if (value !== undefined && value !== null && value !== "All" && value !== "") {
                if (isExact) {
                    // Handle Year as Number if field is end_year or start_year
                    if (field === 'end_year' || field === 'start_year') {
                        query[field] = parseInt(value);
                    } else {
                        query[field] = value;
                    }
                } else {
                    // Normalize regex search
                    query[field] = { $regex: value, $options: 'i' };
                }
            }
        };

        addFilter('end_year', end_year, true);
        addFilter('topic', topic);
        addFilter('sector', sector);
        addFilter('region', region);
        addFilter('pestle', pestle);
        addFilter('source', source);
        addFilter('swot', swot);
        addFilter('country', country);
        addFilter('city', city);

        // Exclude documents with empty end_year if filtering context implies analysis over time? 
        // User said: "Ignore documents where end_year === """
        // But if end_year filter is NOT set, do we exclude them? 
        // "DATA TYPE NORMALIZATION - ... Ignore documents where end_year === """
        // This likely means generally we shouldn't show invalid data? 
        // Or maybe only when filtering? 
        // Let's being safe: IF sorting by year or standard view, usually we want valid years.
        // But for "Get all insights", maybe we keep them. 
        // IMPORTANT: The requirement "Ignore documents where end_year === """ specifically under "DATA TYPE NORMALIZATION" implies we should treat them as non-existent.
        // Let's exclude them if end_year is required for charts.
        // Actually, let's Stick to: Filter ONLY if requested. But query builder "NEVER include filters with value """ means don't query for { end_year: "" }.  

        const limitVal = parseInt(limit) || 1000;

        const insights = await Insight.find(query).limit(limitVal).sort({ added: -1 });

        res.status(200).json({
            success: true,
            count: insights.length,
            data: insights
        });
    } catch (err) {
        console.error("Error in getInsights:", err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Get unique filter values
// @route   GET /api/filters
// @access  Public
exports.getFilters = async (req, res) => {
    try {
        // Use aggregation to get distinct values for each field
        // We match to exclude empty strings first to reduce set size
        const filters = await Insight.aggregate([
            {
                $facet: {
                    end_years: [
                        { $match: { end_year: { $ne: null } } }, // Previous import set "" to null
                        { $group: { _id: "$end_year" } },
                        { $sort: { _id: -1 } }
                    ],
                    topics: [
                        { $match: { topic: { $ne: "" } } },
                        { $group: { _id: "$topic" } },
                        { $sort: { _id: 1 } }
                    ],
                    sectors: [
                        { $match: { sector: { $ne: "" } } },
                        { $group: { _id: "$sector" } },
                        { $sort: { _id: 1 } }
                    ],
                    regions: [
                        { $match: { region: { $ne: "" } } },
                        { $group: { _id: "$region" } },
                        { $sort: { _id: 1 } }
                    ],
                    pestles: [
                        { $match: { pestle: { $ne: "" } } },
                        { $group: { _id: "$pestle" } },
                        { $sort: { _id: 1 } }
                    ],
                    sources: [
                        { $match: { source: { $ne: "" } } },
                        { $group: { _id: "$source" } },
                        { $sort: { _id: 1 } }
                    ],
                    countries: [
                        { $match: { country: { $ne: "" } } },
                        { $group: { _id: "$country" } },
                        { $sort: { _id: 1 } }
                    ],
                    cities: [
                        { $match: { city: { $ne: "" } } },
                        { $group: { _id: "$city" } },
                        { $sort: { _id: 1 } }
                    ],
                    swots: [
                        { $match: { swot: { $ne: "" } } },
                        { $group: { _id: "$swot" } },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);

        const data = filters[0];

        // Flatten the array of objects { _id: val } to [val]
        const format = (arr) => arr.map(x => x._id).filter(x => x !== null && x !== undefined);

        const responseData = {
            end_years: format(data.end_years),
            topics: format(data.topics),
            sectors: format(data.sectors),
            regions: format(data.regions),
            pestles: format(data.pestles),
            sources: format(data.sources),
            countries: format(data.countries),
            cities: format(data.cities),
            swots: format(data.swots),
        };

        res.status(200).json({
            success: true,
            data: responseData
        });
    } catch (err) {
        console.error("Error in getFilters:", err.message);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
