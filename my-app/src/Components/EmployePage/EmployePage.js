import React, { useEffect, useState } from 'react'
import axios from 'axios'
import PageSelector from '../PageSelector/PageSelector'

const EmployePage = () => {
  return (
    <div className='EmployePage'>
      <h2>Modération des commentaires</h2>
      <Moderation />
    </div>
  )
}

const Moderation = () => {
  const [blur, setBlur] = useState(false)
  const [maxPage, setMaxPage] = useState(0)
  const [page, setPage] = useState(1)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true) 

  const SIZE = 4

  useEffect(() => {
    if (!loading) return
    setBlur(true)
    axios.get(`${process.env.REACT_APP_API_URL}/avis/get/unverify-avis`, {
      params: {
        start: page * SIZE - SIZE,
        size: SIZE,
      },
    })
      .then((res) => {
        let json = res.data
        console.log(json)
        setComments(json.data)
        const maxPageNumber = (json.countElement + SIZE - 1) / SIZE
        setMaxPage(parseInt(maxPageNumber))
      })
      .finally(() => {
        setBlur(false)
        setLoading(false)
      })
  }, [loading, page])

  return (
    <div className='CommentList'>
      {comments.map((comment, index) => (
        <Comment key={index} comment={comment} reload={() => setLoading(true)} />
      ))}
      <PageSelector max={maxPage} page={page} setPage={setPage} />
    </div>
  )
}

const Comment = ({ comment, reload }) => {
  return (
    <div>
      <p>{comment.nom}: {comment.contenu}</p>
      <button onClick={() => deleteComment(comment, reload)}>Supprimer</button>
      <button onClick={() => acceptComment(comment, reload)}>Accepter</button>
    </div>
  )
}

const deleteComment = (comment, reload) => {
  axios.delete(`${process.env.REACT_APP_API_URL}/avis/supprimer/${comment.id}`)
    .then(response => {
      reload()
    })
    .catch(error => {
      if (error.response) {
        console.log('Erreur de requête:', error.response.data)
        console.log('Erreur:', error.response.status)
      } else {
        console.log('Erreur lors de la requête', error)
      }
    })
}

const acceptComment = (comment, reload) => {
  axios.put(`${process.env.REACT_APP_API_URL}/avis/accept-comment/${comment.id}`)
    .then((response) => {
      console.log(response)
      reload() 
    })
    .catch(error => {
      if (error.response && error.response.status === 404) {
        console.log("Erreur lors de la modification du commentaire")
      }
    })
}

export default EmployePage