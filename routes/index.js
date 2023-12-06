const AssignmentRoute = require('./assignmentRoute'); 
const HealthZRoute = require('./healthZRoute');
const appRoutes = [
    {
        path : '/v2/assignments',
        route: AssignmentRoute

    },
    {
        path: '/healthz',
        route: HealthZRoute
    },
    {
        path: '*',
        route: (req, res) => res.status(404).send() // Send 404 Not Found for unmatched routes
    }
]

module.exports = app => {
    appRoutes.forEach((route) => {
        app.use(route.path, route.route);
    });
};
