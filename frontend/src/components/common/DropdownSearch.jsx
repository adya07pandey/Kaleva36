import { useState, useEffect } from "react";

const DropdownSearch = ({
  value,
  onSelect,
  searchFunction,
  createFunction,
  placeholder,
}) => {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!query) return;

    const fetch = async () => {
      const res = await searchFunction(query);
      setOptions(res.data);
    };

    fetch();
  }, [query]);

  const handleCreate = async () => {
    const res = await createFunction({ name: query });
    onSelect(res.data);
    setQuery("");
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {options.length > 0 && (
        <div className="dropdown">
          {options.map((opt) => (
            <div
              key={opt.id}
              onClick={() => {
                onSelect(opt);
                setQuery("");
              }}
            >
              {opt.name}
            </div>
          ))}
        </div>
      )}

      {query && options.length === 0 && (
        <div onClick={handleCreate}>
          ➕ Create "{query}"
        </div>
      )}
    </div>
  );
};

export default DropdownSearch;