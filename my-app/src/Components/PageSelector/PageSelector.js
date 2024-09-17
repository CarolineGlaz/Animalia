import './PageSelector.css'

const PageSelector = ({ page = 1, max = 1, setPage }) => {
  const handlePageSwitch = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > max) {
      return;
    }
    setPage(pageNumber);
  };

  // Vérifie si setPage est bien passé
  if (typeof setPage !== "function") {
    return <p>Erreur du passage des props</p>;
  }

  return (
    <div className="page-selector">
      {page !== 1 && <button onClick={() => handlePageSwitch(1)}>1</button>}
      {page > 4 && <label className="dot">..</label>}
      {page > 3 && <button onClick={() => handlePageSwitch(page - 2)}>{page - 2}</button>}
      {page > 2 && <button onClick={() => handlePageSwitch(page - 1)}>{page - 1}</button>}
      <label className="current">{page}</label>
      {page < max - 1 && <button onClick={() => handlePageSwitch(page + 1)}>{page + 1}</button>}
      {page < max - 2 && <button onClick={() => handlePageSwitch(page + 2)}>{page + 2}</button>}
      {page < max - 3 && <label className="dot">..</label>}
      {page !== max && <button onClick={() => handlePageSwitch(max)}>{max}</button>}
    </div>
  );
};

export default PageSelector