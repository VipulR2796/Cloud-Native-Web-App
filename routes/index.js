const AssignmentRoute = require('./assignmentRoute'); 
const HealthZRoute = require('./healthZRoute');
const appRoutes = [
    {
        path : '/v1/assignments',
        route: AssignmentRoute

    },
    {
        path: '/healthz',
        route: HealthZRoute
    }
]

module.exports = app => {
    appRoutes.forEach((route) => {
        app.use(route.path, route.route);
    });
};