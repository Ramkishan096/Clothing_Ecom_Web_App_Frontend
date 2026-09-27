import api from "../api/axios";


const DeletImageOnlyFromCloudnery = async (PublicId) => {
    try {
      console.log('Deleting image from Cloudinary:', PublicId);
      alert("Deleting Image..."+PublicId)

      const response = await api.post('/uploadsimages/deleteimage', {
        imagePublicId: PublicId
      });

      return response.data.success;

    } catch (error) {
      console.log('Delete API error:', error);
      return false;
    }
  };



export default DeletImageOnlyFromCloudnery