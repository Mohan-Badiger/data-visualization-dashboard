const Insight = require('../models/Insight.model');

// @desc    Get all insights with filters
// @route   GET /api/insights
// @access  Public
exports.getInsights = async (req, res) => {
    try {
        const {
            end_year, topic, sector, region, pestle,
            source, swot, country, city, limit
        } = req.query;

        let query = {};

        const addFilter = (field, value, isExact = false) => {
            if (value !== undefined && value !== null && value !== "All" && value !== "") {
                if (isExact) {
                    // end_year and start_year must be numbers
                    if (field === 'end_year' || field === 'start_year') {
                        query[field] = Number(value);
                    } else {
                        query[field] = value;
                    }
                } else {
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
        const filters = await Insight.aggregate([
            {
                $facet: {
                    end_years: [
                        { $match: { end_year: { $nin: ["", null] } } },
                        { $group: { _id: "$end_year" } },
                        { $sort: { _id: -1 } }
                    ],
                    topics: [
                        { $match: { topic: { $nin: ["", null] } } },
                        { $group: { _id: "$topic" } },
                        { $sort: { _id: 1 } }
                    ],
                    sectors: [
                        { $match: { sector: { $nin: ["", null] } } },
                        { $group: { _id: "$sector" } },
                        { $sort: { _id: 1 } }
                    ],
                    regions: [
                        { $match: { region: { $nin: ["", null] } } },
                        { $group: { _id: "$region" } },
                        { $sort: { _id: 1 } }
                    ],
                    pestles: [
                        { $match: { pestle: { $nin: ["", null] } } },
                        { $group: { _id: "$pestle" } },
                        { $sort: { _id: 1 } }
                    ],
                    sources: [
                        { $match: { source: { $nin: ["", null] } } },
                        { $group: { _id: "$source" } },
                        { $sort: { _id: 1 } }
                    ],
                    countries: [
                        { $match: { country: { $nin: ["", null] } } },
                        { $group: { _id: "$country" } },
                        { $sort: { _id: 1 } }
                    ],
                    cities: [
                        { $match: { city: { $nin: ["", null] } } },
                        { $group: { _id: "$city" } },
                        { $sort: { _id: 1 } }
                    ],
                    swots: [
                        { $match: { swot: { $nin: ["", null] } } },
                        { $group: { _id: "$swot" } },
                        { $sort: { _id: 1 } }
                    ]
                }
            }
        ]);

        const facetResult = filters[0];

        const unwrap = (arr) => {
            if (!arr) return [];
            return arr
                .map(item => item._id)
                .filter(val => val !== null && val !== "")
                .sort();
        };

        const responseData = {
            end_years: unwrap(facetResult.end_years).sort((a, b) => b - a),
            topics: unwrap(facetResult.topics),
            sectors: unwrap(facetResult.sectors),
            regions: unwrap(facetResult.regions),
            pestles: unwrap(facetResult.pestles),
            sources: unwrap(facetResult.sources),
            countries: unwrap(facetResult.countries),
            cities: unwrap(facetResult.cities),
            swots: unwrap(facetResult.swots)
        };

        res.status(200).json(responseData);

    } catch (err) {
        console.error("Error in getFilters:", err.message);
        res.status(500).json({ error: 'Server Error' });
    }
};
