/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
import { RISK_PRIORITY, TASK_STATUS, USER_ROLES } from "appConstants";
import { find } from "lodash";
import { Department, Task } from "models";
import { ObjectId } from "mongodb";

export const getDepartmentWiseTaskStatsController = async (
  request,
  response
) => {
  const { user_role, department, _id } = request.userData;
  const findQuery = {};
  const currentDate = new Date();
  try {
    if (user_role === USER_ROLES.HOD) {
      findQuery.department = department._id;
    }
    if (user_role === USER_ROLES.MEMBER) {
      findQuery.owner = { $in: [_id] };
    }

    const departmentWiseStatusCounts = await Task.aggregate([
      {
        $match: findQuery,
      },
      {
        $group: {
          _id: { department: "$department", status: "$status" },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.department",
          total: { $sum: "$count" },
          counts: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
        },
      },
    ]);

    const departmentWiseRiskPriorityCounts = await Task.aggregate([
      {
        $match: findQuery,
      },
      {
        $group: {
          _id: {
            department: "$department",
            risk_rating: "$risk_rating",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    const overdueTaskCounts = await Task.aggregate([
      {
        $match: {
          $and: [
            { ...findQuery },
            {
              status: {
                $in: [TASK_STATUS.IN_PROGRESS],
              },
            },
            { target_date: { $lt: currentDate } },
          ],
        },
      },
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    const pendingApprovalCounts = await Task.aggregate([
      {
        $match: {
          $and: [
            { ...findQuery },
            {
              status: {
                $in: [TASK_STATUS.IN_REVIEW],
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: {
            is_approved_hod: "$is_approved_hod",
            department: "$department",
          },
          count: { $sum: 1 },
        },
      },
    ]);

    await Department.find({}).exec((error, departments) => {
      if (error) {
        response.status(500).send(error.message);
      }
      let resultsWithDepartment = departmentWiseStatusCounts.map(value => {
        const { _id } = value;
        const finalResult = { ...value };
        if (_id) {
          finalResult._id = find(departments, { _id: ObjectId(_id) })?.name;
          const pendingApprovalAdmin = find(pendingApprovalCounts, {
            _id: { is_approved_hod: true, department: _id },
          });
          const pendingApprovalHOD = find(pendingApprovalCounts, {
            _id: { is_approved_hod: false, department: _id },
          });
          const overdueCount = find(overdueTaskCounts, { _id })
            ? find(overdueTaskCounts, { _id }).count
            : 0;
          const adminReviewPending = pendingApprovalAdmin
            ? pendingApprovalAdmin.count
            : 0;

          const hodReviewPending = pendingApprovalHOD
            ? pendingApprovalHOD.count
            : 0;

          finalResult.counts.push(
            {
              status: "OVERDUE",
              count: overdueCount,
            },
            {
              status: "PENDING_ADMIN_APPROVAL",
              count: adminReviewPending,
            },
            {
              status: "PENDING_HOD_APPROVAL",
              count: hodReviewPending,
            }
          );
          Object.values(RISK_PRIORITY).forEach(element => {
            finalResult.counts.push({
              status: element,
              count: find(departmentWiseRiskPriorityCounts, {
                _id: { department: _id, risk_rating: element },
              })
                ? find(departmentWiseRiskPriorityCounts, {
                    _id: { department: _id, risk_rating: element },
                  }).count
                : 0,
            });
          });
        }
        return finalResult;
      });
      response.status(200).json({
        data: resultsWithDepartment,
      });
    });
  } catch (error) {
    return response.status(500).send(error.message);
  }
};

export const getTaskStatsController = async (_request, response) => {
  const currentDate = new Date();
  try {
    const overdueCount = await Task.find({
      status: TASK_STATUS.IN_PROGRESS,
      target_date: { $lt: currentDate },
    }).count();
    const pendingAdminApprovalCount = await Task.find({
      $and: [
        {
          status: {
            $in: [TASK_STATUS.IN_REVIEW],
          },
        },
        { is_approved_hod: true },
      ],
    }).count();
    const pendingHodApprovalCount = await Task.find({
      $and: [
        {
          status: {
            $in: [TASK_STATUS.IN_REVIEW],
          },
        },
        { is_approved_hod: false },
      ],
    }).count();
    const statusCounts = await Task.aggregate([
      {
        $group: {
          _id: "$risk_rating",
          count: { $sum: 1 },
        },
      },
    ]);
    await Task.aggregate(
      [
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$count" },
            counts: { $push: { status: "$_id", count: "$count" } },
          },
        },
      ],
      async (error, results) => {
        if (error) {
          return response.status(500).send(error.message);
        }
        Object.values(RISK_PRIORITY).forEach(element => {
          results[0].counts.push({
            status: element,
            count: find(statusCounts, { _id: element })
              ? find(statusCounts, { _id: element }).count
              : 0,
          });
        });
        results[0].counts.push(
          {
            status: "OVERDUE",
            count: overdueCount,
          },
          {
            status: "PENDING_ADMIN_APPROVAL",
            count: pendingAdminApprovalCount,
          },
          {
            status: "PENDING_HOD_APPROVAL",
            count: pendingHodApprovalCount,
          }
        );
        return response.status(200).json({ data: results });
      }
    );
  } catch (error) {
    return response.status(500).send(error.message);
  }
};
