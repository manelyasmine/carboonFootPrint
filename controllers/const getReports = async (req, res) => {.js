const getReports = async (req, res) => {
  console.log("getReports");
  try {
    const { start, end, page = 1, limit = 8, search, column, operator, value } = req.query;
 
    const searchFilter = {};
    if (search) {
      searchFilter.$or = [
        { name: { $regex: search, $options: 'i' } },  
        { type: { $regex: search, $options: 'i' } }, 
      ];
    }
 
    if (start && end) {
      searchFilter.startDate = { $gte: Number(start) };
      searchFilter.endDate = { $lte: Number(end) };
    }
 
   /*  if (column && operator && value) {
      const validColumns = ['name', 'type', 'emissionReduction'];
      if (!validColumns.includes(column)) {
        return res.status(400).json({ error: `Invalid column name: ${column}` });
      }

      const validOperators = ['equals', 'startsWith', 'endsWith', 'contains', 'greaterThan', 'lessThan'];
      if (!validOperators.includes(operator)) {
        return res.status(400).json({ error: `Invalid operator: ${operator}` });
      }

      let filterExpression;
      switch (operator) {
        case 'equals':
          filterExpression = { [column]: value };
          break;
        case 'startsWith':
          filterExpression = { [column]: { $regex: new RegExp(`^${value}`, "i") } };
          break;
        case 'endsWith':
          filterExpression = { [column]: { $regex: new RegExp(`${value}$`, "i") } };
          break;
        case 'contains':
          filterExpression = { [column]: { $regex: new RegExp(value, "i") } };
          break;
        case 'greaterThan':
          filterExpression = { [column]: { $gt: value } };
          break;
        case 'lessThan':
          filterExpression = { [column]: { $lt: value } };
          break;
        default:
          // Handle unsupported operators (if applicable)
          break;
      }

      searchFilter.$and = searchFilter.$and || [];
      searchFilter.$and.push(filterExpression);
    } */
 
 
    const total = await report.countDocuments(searchFilter);
    const totalPages = Math.ceil(total / limit);
    const pageMin = Math.min(Math.max(page, 1), totalPages); // Clamp page between 1 and total pages

    const skip = (pageMin - 1) * limit; // Use pageMin for correct pagination
    const reportRoles = await report.find({}).populate('createdBy', { profileImage: 1 })
      .skip(skip)
      .limit(limit);

    res.json({ reportRoles, total, pageMin, totalPages });
  } catch (e) {
    console.error("Error fetching reports:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};