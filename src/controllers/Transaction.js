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

router.put("/cancel/:id", async (req, res) => {
  try {
    const findTransactionById = await Transaction.findById(req.params.id);
    if (!findTransactionById) {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "TRANSACTION NOT FOUND";
      res.status(200).json(templateResponse);
      return;
    }
    if (findTransactionById.status !== "1") {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "TRANSACTION CANNOT TO CANCEL";
      res.status(200).json(templateResponse);
      return;
    }
    try {
      const FindProductById = await Product.findById(
        findTransactionById.product
      );
      if (!FindProductById) {
        const templateResponse = responseTemplate.error;
        templateResponse.message = "PRODUCT NOT FOUND";
        res.status(200).json(templateResponse);
        return;
      }
      try {
        const findUserBuyerById = await User.findById(
          findTransactionById.buyer
        );
        if (!findUserBuyerById) {
          const templateResponse = responseTemplate.error;
          templateResponse.message = "BUYER NOT FOUND";
          res.status(200).json(templateResponse);
          return;
        }
        try {
          const UpdateUserWallet = await Wallet.findByIdAndUpdate(
            findUserBuyerById.wallet,
            {
              $inc: {
                balance:
                  +FindProductById.price * findTransactionById.quantity +
                  findTransactionById.deliveryCost +
                  findTransactionById.adminFee,
              },
            }
          );
          if (!UpdateUserWallet) {
            const templateResponse = responseTemplate.error;
            templateResponse.message = "FAILED UPDATE USER WALLET";
            res.status(200).json(templateResponse);
            return;
          }
          try {
            const SetOrderStatus = await Transaction.findByIdAndUpdate(
              req.params.id,
              {
                status: "4",
              }
            );
            if (!SetOrderStatus) {
              const templateResponse = responseTemplate.error;
              templateResponse.message = "FAILED UPDATE ORDER STATUS";
              res.status(200).json(templateResponse);
              return;
            }
            const templateResponse = responseTemplate.success;
            templateResponse.data = SetOrderStatus;
            res.status(200).json(templateResponse);
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
  } catch (error) {
    const templateResponse = responseTemplate.error;
    templateResponse.message = `${error}`;
    res.status(200).json(templateResponse);
  }
});

router.put("/completion/:id", async (req, res) => {
  try {
    const FindTransactionById = await Transaction.findById(req.params.id);
    if (!FindTransactionById) {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "TRANSACTION NOT FOUND";
      res.status(200).json(templateResponse);
      return;
    }
    if (FindTransactionById.status !== "2") {
      const templateResponse = responseTemplate.error;
      templateResponse.message = "TRANSACTION NOT CONFIRMED";
      res.status(200).json(templateResponse);
      return;
    }
    try {
      const FindProductById = await Product.findById(
        FindTransactionById.product
      );
      if (!FindProductById) {
        const templateResponse = responseTemplate.error;
        templateResponse.message = "PRODUCT NOT FOUND";
        res.status(200).json(templateResponse);
        return;
      }
      try {
        const FindUserSellerById = await User.findById(FindProductById.seller);
        if (!FindUserSellerById) {
          const templateResponse = responseTemplate.error;
          templateResponse.message = "SELLER NOT FOUND";
          res.status(200).json(templateResponse);
          return;
        }
        try {
          const UpdateWalletSeller = await Wallet.findByIdAndUpdate(
            FindUserSellerById.wallet,
            { $inc: { balance: (+FindProductById.price * 98) / 100 } }
          );
          if (!UpdateWalletSeller) {
            const templateResponse = responseTemplate.error;
            templateResponse.message = "FAILED TO UPDATE SELLER WALLET";
            res.status(200).json(templateResponse);
            return;
          }
          try {
            const FindResiById = await Resi.findById(FindTransactionById.resi);
            if (!FindResiById) {
              const templateResponse = responseTemplate.error;
              templateResponse.message = `RESI NOT FOUND ${FindTransactionById.resi}`;
              res.status(200).json(templateResponse);
              return;
            }
            try {
              const FindUserDriverById = await User.findById(
                FindResiById.driver
              );
              if (!FindUserDriverById) {
                const templateResponse = responseTemplate.error;
                templateResponse.message = "DRIVER NOT FOUND";
                res.status(200).json(templateResponse);
                return;
              }
              try {
                const UpdateWalletDriver = await Wallet.findByIdAndUpdate(
                  FindUserDriverById.wallet,
                  {
                    $inc: {
                      balance: (+FindTransactionById.deliveryCost * 95) / 100,
                    },
                  }
                );
                if (!UpdateWalletDriver) {
                  const templateResponse = responseTemplate.error;
                  templateResponse.message = "FAILED TO UPDATE WALLET DRIVER";
                  res.status(200).json(templateResponse);
                  return;
                }
                try {
                  const FindAdminByUserType = await User.findOne({
                    userType: 1,
                  });
                  if (!FindAdminByUserType) {
                    const templateResponse = responseTemplate.error;
                    templateResponse.message = "ADMIN NOT FOUND";
                    res.status(200).json(templateResponse);
                    return;
                  }
                  try {
                    const UpdateWalletAdmin = await Wallet.findByIdAndUpdate(
                      FindAdminByUserType.wallet,
                      {
                        $inc: {
                          balance:
                            (+FindTransactionById.deliveryCost * 5) / 100 +
                            FindTransactionById.adminFee +
                            (FindProductById.price * 2) / 100,
                        },
                      }
                    );
                    if (!UpdateWalletAdmin) {
                      const templateResponse = responseTemplate.error;
                      templateResponse.message =
                        "FAILED TO UPDATE WALLET DRIVER";
                      res.status(200).json(templateResponse);
                      return;
                    }
                    try {
                      const SetOrderStatus = await Transaction.findByIdAndUpdate(
                        req.params.id,
                        {
                          status: "3",
                        }
                      );
                      if (!SetOrderStatus) {
                        const templateResponse = responseTemplate.error;
                        templateResponse.message = "FAILED UPDATE ORDER STATUS";
                        res.status(200).json(templateResponse);
                        return;
                      }
                      const templateResponse = responseTemplate.success;
                      templateResponse.data = SetOrderStatus;
                      res.status(200).json(templateResponse);
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
        } catch (error) {
          const templateResponse = responseTemplate.error;
          templateResponse.message = `${error}`;
          res.status(200).json(templateResponse);
        }
      } catch {
        const templateResponse = responseTemplate.error;
        templateResponse.message = `${error}`;
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
});

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
                        resi: DBResiInteraction._id,
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
