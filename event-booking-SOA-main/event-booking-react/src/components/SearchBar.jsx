import React, { useState } from "react";
import "../styles/SearchBar.css";

function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");

  const handleSearch = (query) => {
    setSearchQuery(query);
    onSearch(query, searchType);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>

      <div className="search-filters">
        <select
          value={searchType}
          onChange={(e) => {
            setSearchType(e.target.value);
            handleSearch(searchQuery);
          }}
          className="filter-select"
        >
          <option value="title">By Title</option>
          <option value="location">By Location</option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;
