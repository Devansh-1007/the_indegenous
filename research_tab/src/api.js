import axios from "axios";

export const handleSearch = async (searchKeyword) => {
  try {
    let requestData = {
      keyword: searchKeyword,
      limit: 10,
    };

    const response = await axios.post(
      "https://api.gyanibooks.com/search_publication/",
      requestData
    );
    return response.data.data || [];
  } catch (error) {
    return [];
  }
};
