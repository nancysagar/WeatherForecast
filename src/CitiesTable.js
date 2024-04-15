import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import Autocomplete from 'react-autocomplete'; 
import "./CitiesTable.css";

function CitiesTable() {
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortOption, setSortOption] = useState('');
  const [filterOption, setFilterOption] = useState('');

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&page=${currentPage}`
        );
        const citiesData = response.data.results;
        setCities(prevCities => [...prevCities, ...citiesData]);
        setFilteredCities(prevCities => [...prevCities, ...citiesData]);
        setHasMore(citiesData.length === 20);
      } catch (error) {
        console.error('Error fetching cities data:', error);
      }
    };

    fetchCities();
  }, [currentPage]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    const filteredSuggestions = inputLength === 0 ? [] : cities.filter(city =>
      city.name.toLowerCase().slice(0, inputLength) === inputValue
    );
    setSuggestions(filteredSuggestions);
  };

  const handleSort = (columnName) => {
    let sortedCities;
    if (sortOption === 'asc') {
      sortedCities = [...filteredCities].sort((a, b) => a[columnName].localeCompare(b[columnName]));
    } else {
      sortedCities = [...filteredCities].sort((a, b) => b[columnName].localeCompare(a[columnName]));
    }
    setFilteredCities(sortedCities);
  };

  const handleFilter = (option) => {
    setFilterOption(option);
    let filteredCities;
    switch (option) {
      case 'asc_name':
        filteredCities = [...cities].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'asc_country':
        filteredCities = [...cities].sort((a, b) => a.cou_name_en.localeCompare(b.cou_name_en));
        break;
      case 'asc_timezone':
        filteredCities = [...cities].sort((a, b) => a.timezone.localeCompare(b.timezone));
        break;
      case 'desc_name':
        filteredCities = [...cities].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'desc_country':
        filteredCities = [...cities].sort((a, b) => b.cou_name_en.localeCompare(a.cou_name_en));
        break;
      case 'desc_timezone':
        filteredCities = [...cities].sort((a, b) => b.timezone.localeCompare(a.timezone));
        break;
      default:
        filteredCities = [...cities];
    }
    setFilteredCities(filteredCities);
  };

  const handleCityClick = (city) => {
    localStorage.setItem('selectedCity', city.name);
    window.open('/weather', '_parent');
  };

  const handleCityRightClick = (city, event) => {
    event.preventDefault();
    const menu = [
        { label: 'Open Link in New Tab', action: () => window.open('/weather', '_blank') },
        { label: 'Open Link in New Window', action: () => window.open('/weather', '_blank', 'noopener') },
        { label: 'Copy Link Address', action: () => navigator.clipboard.writeText('/weather') }
    ];
    const menuPosition = { x: event.clientX, y: event.clientY };
    showContextMenu(menu, menuPosition);
  };

  const showContextMenu = (menu, position) => {
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }
    const contextMenu = document.createElement('ul');
    contextMenu.className = 'context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.top = `${position.y}px`;
    contextMenu.style.left = `${position.x}px`;
    menu.forEach(option => {
      const menuItem = document.createElement('li');
      menuItem.textContent = option.label;
      menuItem.addEventListener('click', option.action);
      contextMenu.appendChild(menuItem);
    });
    document.body.appendChild(contextMenu);
    document.addEventListener('click', closeContextMenu);
  };

  const closeContextMenu = (event) => {
    const contextMenu = document.querySelector('.context-menu');
    if (contextMenu && !contextMenu.contains(event.target)) {
      contextMenu.remove();
    }
  };

  const fetchData = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <div className="cities-table-container">
      <div className="search-filter-container">
        <Autocomplete
          items={suggestions}
          getItemValue={(item) => item.name}
          renderItem={(item, isHighlighted) => (
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.name}
            </div>
          )}
          value={searchQuery}
          onChange={handleSearchChange}
          onSelect={value => setSearchQuery(value)}
          inputProps={{ placeholder: 'Search cities...' }}
        />
        <div className="filters">
          <select value={filterOption} onChange={(e) => handleFilter(e.target.value)}>
            <option value="">Filter</option>
            <option value="asc_name">Ascending order by city name</option>
            <option value="asc_country">Ascending order by Country</option>
            <option value="asc_timezone">Ascending order by Timezone</option>
            <option value="desc_name">Descending by city name</option>
            <option value="desc_country">Descending by Country</option>
            <option value="desc_timezone">Descending by Timezone</option>
          </select>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      <InfiniteScroll
        dataLength={cities.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<div className="loading">Loading...</div>}
        endMessage={<div className="no-more">No more data to load.</div>}
      >
        <table className="cities-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">City Name</th>
              <th onClick={() => handleSort('cou_name_en')} className="sortable">Country</th>
              <th onClick={() => handleSort('timezone')} className="sortable">Timezone</th>
            </tr>
          </thead>
          <tbody>
            {filteredCities.map(city => (
              <tr key={city.geoname_id}>
                <td onClick={(event) => handleCityClick(city)} onContextMenu={(event) => handleCityRightClick(city, event)}>{city.name}</td>
                <td>{city.cou_name_en}</td>
                <td>{city.timezone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfiniteScroll>
    </div>
  );
}

export default CitiesTable;
