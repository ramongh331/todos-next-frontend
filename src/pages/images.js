import { CldImage, CldUploadWidget } from 'next-cloudinary';

export default function Images () {
    return (<><h3>Hello There</h3>
    <CldImage
  width="600"
  height="600" 
  src="https://res.cloudinary.com/dicl3hga9/image/upload/v1678409219/cld-sample-2.jpg"
  alt="My Image"
/>

<CldUploadWidget uploadPreset="todo-profile-pic">
  {({ open }) => {
    function handleOnClick(e) {
      e.preventDefault();
      open();
    }
    return (
      <button onClick={handleOnClick}>
        Upload an Image
      </button>
    );
  }}
</CldUploadWidget>
</>)
}