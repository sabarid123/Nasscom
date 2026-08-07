const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

router.use(protect);
router.use(authorize('ADMIN'));

router.get('/analytics', adminController.getDashboardAnalytics);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUserStatus);
router.delete('/users/:id', adminController.deleteUser);
router.get('/transactions', adminController.getAllTransactions);
router.delete('/transactions/:id', adminController.deleteTransaction);
router.get('/reports/export-transactions', adminController.exportTransactionsCSV);
router.get('/reports/export-users', adminController.exportUsersCSV);

module.exports = router;
