// export function to check if user has Admin Priveleges in or not route back to home screen
module.exports = (req, res, next) => {
    if (!req.session.user.adminPriveleges) {
        return res.redirect('/');
    }
    next();
}