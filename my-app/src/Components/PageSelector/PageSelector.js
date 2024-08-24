import './PageSelector.css'

const PageSelector = (props) => {
  const page = props.page
  const max = props.max
  const setPage = props.setPage

  const handlePageSwitch = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > max) {
      return
    }
    setPage(pageNumber)
  }



  if (!page || !max || !setPage)
    return <p>Erreur du passage des props</p>

  return (
    <div  className="page-selector">
      {
        page !== 1 ?
          <button onClick={() => handlePageSwitch(1)}>1</button>
          : null
      }
      {
        page > 4 ?
          <label className="dot">..</label>
          : null
      }
      {
        page > 3 ?
          <button onClick={() => handlePageSwitch(page - 2)}>{page - 2}</button>
          : null
      }
      {
        page > 2 ?
          <button onClick={() => handlePageSwitch(page - 1)}>{page - 1}</button>
          : null
      }
      <label className="current" >{page}</label>
      {
        page < max - 1 ?
          <button onClick={() => handlePageSwitch(page + 1)}>{page + 1}</button>
          : null
      }
      {
        page < max - 2 ?
          <button onClick={() => handlePageSwitch(page + 2)}>{page + 2}</button>
          : null
      }
      {
        page < max - 3 ?
          <label className="dot">..</label>
          : null
      }
      {
        page !== max ?
          <button onClick={() => handlePageSwitch(max)}>{max}</button>
          : null
      }
    </div>
  )

}

export default PageSelector