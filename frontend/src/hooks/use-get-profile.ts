import cookies from 'js-cookie';

const profile = cookies.get('currentProfile');

const useGetProfile = () => profile || undefined;

export default useGetProfile;

