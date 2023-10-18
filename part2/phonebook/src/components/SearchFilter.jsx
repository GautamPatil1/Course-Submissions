const SearchFilter = ({ searchTerm, handleSearchChange }) => {
    return (
      <div>
        Search Filter <input value={searchTerm} onChange={handleSearchChange} />
      </div>
    );
  };
  
  export default SearchFilter;