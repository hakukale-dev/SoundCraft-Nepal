import PropTypes from 'prop-types';

function Protected ( { user, props } )
{
    return user ? props : <h1>Protected Route</h1>;
}

Protected.propTypes = {
    user: PropTypes.object,
    props: PropTypes.node.isRequired,
};

export default Protected