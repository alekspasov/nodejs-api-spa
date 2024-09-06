import Image from './Image';
import './Avatar.css';

const Avatar = ({size, image}) => {
    return (
        <div
            className="avatar"
            style={{width: size + 'rem', height: size + 'rem'}}
        >
            <Image imageUrl={image}/>
        </div>
    )
}

export default Avatar;