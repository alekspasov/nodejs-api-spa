import './Image.css';


const Image = ({imageUrl, contain, left}) => {
    return (
        <div
            className="image"
            style={{
                backgroundImage: `url('${imageUrl}')`,
                backgroundSize: contain ? 'contain' : 'cover',
                backgroundPosition: left ? 'left' : 'center'
            }}
        />
    )
}

export default Image;