const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Product = require("../models/Product");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const Resi = require("../models/Resi");
const responseTemplate = require("../response-templates");

router.get("/:id", async (req, res) => {
  try {
    const DBTransactionInteraction = await Transaction.findById(req.params.id);
    if (DBTransactionInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBTransactionInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "DATA NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = ` ${error}`;
    res.json(templateResponse);
  }
});

router.get("/", async (req, res) => {
  try {
    const DBTransactionInteraction = await Transaction.find({});
    if (DBTransactionInteraction) {
      const templateResponse = responseTemplate.success;
      templateResponse.data = DBTransactionInteraction;
      res.status(200).json(templateResponse);
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = DBTransactionInteraction;
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = error;
    res.json(templateResponse);
  }
});

router.delete("/cancleOrede/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const CancleOrede = await Transaction.findByIdAndRemove(id);
    if (CancleOrede) {
      res.status(404).send({
        message: `Cannot delete Transaction with id=${id}. Maybe Transaction was not found!`,
      });
    } else {
      res.send({ message: "Transaction was deleted successfully!" });
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = `${error}`;
    res.status(200).json(templateResponse);
  }
});

// router.put("/completion/:id", async (req, res) => {
//   try {
//     const DBTransactionInteraction = await Transaction.findById(req.params.id);
//     if (DBTransactionInteraction) {
//       try {
//         const DBProductInteraction = await Product.findById(
//           DBTransactionInteraction.product
//         );
//         if (DBProductInteraction) {
//           try {
//             const DBResiInteraction = await Resi.findById(
//               DBTransactionInteraction.resi
//             );
//             if (DBResiInteraction) {
//               try {
//                 const CheckingUserWalletSeller = await User.findById(
//                   DBResiInteraction.sender
//                 );
//                 if (CheckingUserWalletSeller) {
//                   try {
//                     var hasilPenjual = (DBProductInteraction.price * 98) / 100;
//                     try {
//                       const CheckingUserWallet;
//                     } catch (error) {
//                       const templateResponse = responseTemplate.error;
//                       templateResponse.message = `${error}`;
//                       res.status(200).json(templateResponse);
//                     }
//                   } catch (error) {
//                     const templateResponse = responseTemplate.error;
//                     templateResponse.message = `${error}`;
//                     res.status(200).json(templateResponse);
//                   }
//                 } else {
//                   const templateResponse = responseTemplate.error;
//                   templateResponse.message = "USER TIDAK DITEMUKAN";
//                   res.status(200).json(templateResponse);
//                 }
//               } catch (error) {
//                 const templateResponse = responseTemplate.error;
//                 templateResponse.message = `${error}`;
//                 res.status(200).json(templateResponse);
//               }
//             } else {
//               const templateResponse = responseTemplate.error;
//               templateResponse.message = "PESANAN BELUM TERKONFIRMASI";
//               res.status(200).json(templateResponse);
//             }
//           } catch (error) {
//             const templateResponse = responseTemplate.error;
//             templateResponse.message = `${error}`;
//             res.status(200).json(templateResponse);
//           }
//         } else {
//           const templateResponse = responseTemplate.error;
//           templateResponse.message = "PRODUCT NOT FOUND";
//           res.status(200).json(templateResponse);
//         }
//       } catch (error) {
//         const templateResponse = responseTemplate.error;
//         templateResponse.message = `${error}`;
//         res.status(200).json(templateResponse);
//       }
//     } else {
//       const templateResponse = responseTemplate.error;
//       templateResponse.message = "TRANSACTION NOT FOUND";
//       res.status(200).json(templateResponse);
//     }
//   } catch (error) {
//     const templateResponse = responseTemplate.error;
//     templateResponse.message = `${error}`;
//     res.status(200).json(templateResponse);
//   }
// });

router.put("/procces/:id", async (req, res) => {
  try {
    const DBTransactionInteraction = await Transaction.findById(req.params.id);
    if (DBTransactionInteraction) {
      try {
        const DBProductInteraction = await Product.findById(
          DBTransactionInteraction.product
        );
        if (DBProductInteraction) {
          try {
            const DBUserFindDriver = await User.findOne({ userType: 4 });
            if (DBUserFindDriver) {
              try {
                const newResi = new Resi({
                  sender: DBProductInteraction.seller,
                  receiver: DBTransactionInteraction.buyer,
                  driver: DBUserFindDriver._id,
                  deliveryCost: DBTransactionInteraction.deliveryCost,
                  address: DBTransactionInteraction.address,
                  isDelivered: false,
                });
                const DBResiInteraction = await newResi.save();
                if (DBResiInteraction) {
                  try {
                    const DBUpdateTransactionInteraction = await Transaction.findByIdAndUpdate(
                      req.params.id,
                      {
                        status: "2",
                        resi: DBUserFindDriver._id,
                      }
                    );
                    if (DBUpdateTransactionInteraction) {
                      const templateResponse = responseTemplate.success;
                      templateResponse.data = DBUpdateTransactionInteraction;
                      res.status(200).json(templateResponse);
                    } else {
                      const templateResponse = responseTemplate.error;
                      templateResponse.message =
                        "FAILED SET TRANSACTION STATUS";
                      res.status(200).json(templateResponse);
                    }
                  } catch (error) {
                    const templateResponse = responseTemplate.error;
                    templateResponse.message = `${error}`;
                    res.status(200).json(templateResponse);
                  }
                } else {
                  const templateResponse = responseTemplate.error;
                  templateResponse.message = "FAILED CREATE RESI";
                  res.status(200).json(templateResponse);
                }
              } catch (error) {
                const templateResponse = responseTemplate.error;
                templateResponse.message = `${error}`;
                res.status(200).json(templateResponse);
              }
            } else {
              const templateResponse = responseTemplate.error;
              templateResponse.message = "DRIVER NOT FOUND";
              res.status(200).json(templateResponse);
            }
          } catch (error) {
            const templateResponse = responseTemplate.error;
            templateResponse.message = `${error}`;
            res.status(200).json(templateResponse);
          }
        } else {
          const templateResponse = responseTemplate.error;
          templateResponse.message = "PRODUCT NOT FOUND";
          res.status(200).json(templateResponse);
        }
      } catch (error) {
        const templateResponse = responseTemplate.error;
        templateResponse.message = `${error}`;
        res.status(200).json(templateResponse);
      }
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "TRANSACTION NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = `${error}`;
    res.status(200).json(templateResponse);
  }
});

router.post("/", async (req, res) => {
  var { buyer, product, deliveryCost, address, adminFee, quantity } = req.body;
  try {
    const DBUserInteraction = await User.findById(buyer);
    if (DBUserInteraction) {
      try {
        const DBProductInteraction = await Product.findById(product);
        if (DBProductInteraction) {
          try {
            var shoppingCost =
              DBProductInteraction.price * parseFloat(quantity) +
              parseFloat(deliveryCost) +
              parseFloat(adminFee);
            try {
              const DBWalletInteractionChackingBalanceUsable = await Wallet.findById(
                DBUserInteraction.wallet
              );
              if (DBWalletInteractionChackingBalanceUsable) {
                if (
                  DBWalletInteractionChackingBalanceUsable.balance >
                  shoppingCost
                ) {
                  const DBWalletInteraction = await Wallet.findByIdAndUpdate(
                    DBUserInteraction.wallet,
                    { $inc: { balance: -shoppingCost } }
                  );
                  if (DBWalletInteraction) {
                    try {
                      const newTransaction = new Transaction({
                        buyer: buyer,
                        product: product,
                        deliveryCost: deliveryCost,
                        address: address,
                        quantity: quantity,
                        adminFee: adminFee,
                        status: "1",
                        resi: null,
                      });
                      const DBTransactionInteraction = await newTransaction.save();
                      if (DBTransactionInteraction) {
                        const templateResponse = responseTemplate.success;
                        templateResponse.data = DBTransactionInteraction;
                        res.status(200).json(templateResponse);
                      } else {
                        const templateResponse = responseTemplate.error;
                        templateResponse.message = DBTransactionInteraction;
                        res.status(200).json(templateResponse);
                      }
                    } catch (error) {
                      const templateResponse = responseTemplate.error;
                      templateResponse.message = `${error}`;
                      res.status(200).json(templateResponse);
                    }
                  } else {
                    const templateResponse = responseTemplate.error;
                    templateResponse.message = "Failed To Debet Wallet";
                    res.status(200).json(templateResponse);
                  }
                } else {
                  const templateResponse = responseTemplate.error;
                  templateResponse.message =
                    "SALDO ANDA TIDAK CUKUP , SILAHKAN TOP UP";
                  res.status(200).json(templateResponse);
                }
              } else {
                const templateResponse = responseTemplate.error;
                templateResponse.message = DBWalletInteractionChackingBalanceUsable;
                res.status(200).json(templateResponse);
              }
            } catch (error) {
              const templateResponse = responseTemplate.error;
              templateResponse.message = `${error}`;
              res.status(200).json(templateResponse);
            }
          } catch (error) {
            const templateResponse = responseTemplate.error;
            templateResponse.message = `${error}`;
            res.status(200).json(templateResponse);
          }
        } else {
          const templateResponse = responseTemplate.error;
          templateResponse.message = "PRODUCT NOT FOUND";
          res.status(200).json(templateResponse);
        }
      } catch (error) {
        const templateResponse = responseTemplate.error;
        templateResponse.message = `${error}`;
        res.status(200).json(templateResponse);
      }
    } else {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "USER NOT FOUND";
      res.status(200).json(templateResponse);
    }
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = `${error}`;
    res.status(200).json(templateResponse);
  }
});

module.exports = router;
