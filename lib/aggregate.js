import { Statement } from './models'

export default function getAgg() {
  return Statement.aggregate([
    {
      "$facet": {
        "bar": [
          {
            $group: {
              _id: {
                id: "$_id",
                alias: "$alias",
                month: {
                  $month: {
                    date: "$createdAt"
                  }
                },
                year: {
                  $year: {
                    date: "$createdAt"
                  }
                },
                createdAt: "$createdAt"
              },
              total: {
                $sum: "$amount"
              }
            }
          },
          {
            $group: {
              _id: {
                alias: "$_id.alias",
                year: "$_id.year",
                month: "$_id.month",
                
              },
              total: {
                $sum: "$total"
              },
              
            }
          },
          {
            $set: {
              month: "$_id.month",
              year: "$_id.year",
              alias: "$_id.alias"
            }
          },
          {
            $sort: {
              year: 1,
              month: 1
            }
          }
        ],
        "raw": [
          {
            $project: {
              date: "$createdAt",
              description: 1,
              amount: 1,
              by: "$alias",
            }
          },
          {
            $sort: {
              date: -1 // Sort by the createdAt field in descending order
            }
          }
        ],
        "doughnut": [
          {
            $group: {
              _id: {
                alias: "$alias"
              },
              total: {
                $sum: "$amount"
              }
            }
          },
          {
            $set: {
              alias: "$_id.alias"
            }
          }
        ]
      }
    }
  ])
}