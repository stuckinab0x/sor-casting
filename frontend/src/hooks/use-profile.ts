import cookies from 'js-cookie';

const profile = cookies.get('currentProfile');

const useProfile = () => profile || undefined;

export default useProfile;

