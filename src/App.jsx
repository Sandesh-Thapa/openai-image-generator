import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'

function App() {
  const [title, setTitle] = useState("")
  const sizes = ["SMALL", "MEDIUM", "LARGE"]
  const [size, setSize] = useState(sizes[0])
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const renderSizeOptions = () => {
    return sizes.map((size, i) => {
      return <option key={i}>{size}</option>;
    });
  }

  const submitForm = async (e) => {
    e.preventDefault()

    if (title !== "") {
      setLoading(true)
      const configuration = new Configuration({
        apiKey: import.meta.env.VITE_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      const imageSize = size === 'SMALL' ? '256x256' : size === 'MEDIUM' ? '512x512' : '1024x1024';

      try {
        const response = await openai.createImage({
          prompt: title,
          n: 1,
          size: imageSize,
        });
        setImage(response.data.data[0].url)
        setLoading(false)
      } catch (error) {
        if (error.response) {
          alert(error.response.data);
        } else {
          alert(error.message);
        }
        setLoading(false)
      }
    } else {
      alert("All fields are required!")
    }
  }

  return (
    <div>
      <div className="bg-dark py-3 navbar">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <a className="text-white btn fs-4 fw-semibold" href="/">Image Generator</a>
          </div>
          <span className="text-white">Powered by <a className="text-white" href="https://openai.com/">OpenAI</a></span>
        </div>
      </div>
      <div className="container">
        <div className="col-12 col-md-8 p-4 mx-auto">
        <form onSubmit={submitForm}>
          <div className="mb-3">
            <input type="text" placeholder="example: a white siamese cat" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="mb-3">
            <select className="form-control" onChange={(e)=>setSize(e.target.value)}>
              {renderSizeOptions()}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : "Submit"}
            </button>
        </form>
        </div>
        <div className="my-5">
          <div className="d-flex justify-content-center">
            {loading ? <img src='/hourglass.gif' /> : image && (
              <img src={image} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
