require("dotenv").config();
const dboperations = require("./Api/Inventory/Operations/INV_Queries");
const express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const app = express();
var router = express.Router();
const PORT = 8090;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use("/api", router);

router.use((request, response, next) => {
  next();
});

router.route("/inventory").get(async (request, response) => {
  // Get page and pageSize from query parameters (default to 1 and 20 if not provided)
  const page = parseInt(request.query.page) || 1;
  const pageSize = parseInt(request.query.pageSize) || 20;

  try {
    // Fetch paginated data from the database
    const result = await dboperations.getInventorys(page, pageSize);

    // Send the paginated result back to the client
    response.json(result);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    response.status(500).send("Internal Server Error");
  }
});

router.route("/getAllVendorItemPagination").get(async (request, response) => {
  // Get page and pageSize from query parameters (default to 1 and 20 if not provided)
  const page = parseInt(request.query.page) || 1;
  const pageSize = parseInt(request.query.pageSize) || 20;

  try {
    // Fetch paginated data from the database
    const result = await dboperations.getAllvendoritems_Pagination(
      page,
      pageSize
    );

    // Send the paginated result back to the client
    response.json(result);
  } catch (error) {
    console.error("Error fetching inventory:", error);
    response.status(500).send("Internal Server Error");
  }
});

// Assuming you have express setup and dboperations is imported

router.route("/vendoritemspage").get(async (request, response) => {
  // Get Vendor_Number, page, and pageSize from query parameters (with defaults)
  const Vendor_Number = request.query.Vendor_Number; // Vendor_Number is required
  const page = parseInt(request.query.page) || 1; // Default to page 1
  const pageSize = parseInt(request.query.pageSize) || 20; // Default to 20 items per page

  if (!Vendor_Number) {
    return response.status(400).send("Vendor_Number is required");
  }

  try {
    // Fetch paginated data for the given Vendor_Number
    const result = await dboperations.get_Vendor_Items_Page(
      Vendor_Number,
      page,
      pageSize
    );

    // Send the paginated result back to the client
    response.json(result);
  } catch (error) {
    console.error("Error fetching vendor items:", error);
    response.status(500).send("Internal Server Error");
  }
});

router.route("/getAllvendoritems").get((request, response) => {
  dboperations.get_All_Vendor_Items().then((result) => {
    response.json(result[0]);
  });
});

router.route("/inventory/:ItemNum").get((request, response) => {
  dboperations.getInventory(request.params.ItemNum).then((result) => {
    response.json(result[0]);
  });
});

router.route("/inventorybydepid/:Dept_ID").get((request, response) => {
  dboperations.getInventoryByDepID(request.params.Dept_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getVendorDetails/:Vendor_Number").get((request, response) => {
  dboperations
    .get_Vender_Details(request.params.Vendor_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router
  .route("/getLotteryEndShift/:ItemNum/:Datetime")
  .get((request, response) => {
    dboperations
      .getLotteryInvoiceDetails(request.params.ItemNum, request.params.Datetime)
      .then((result) => {
        response.json(result[0]);
      });
  });

router.route("/inventorynopg").get((request, response) => {
  dboperations.getInventoryNoPg().then((result) => {
    response.json(result[0]);
  });
});
router.route("/getLotteryTotals/:Dept_ID").get((request, response) => {
  dboperations.getLotteryTotalValue(request.params.Dept_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getLatestSoldItems").get((request, response) => {
  dboperations.getLatestSoldItems(request.params.ItemNum).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getAllTransHistory").get((request, response) => {
  dboperations.get_All_Trans_History().then((result) => {
    response.json(result[0]);
  });
});

router.route("/getinventoryrefid").get((request, response) => {
  dboperations
    .get_Inventory_Reference_ID(request.params.ItemNum)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getinvoiceID").get((request, response) => {
  dboperations.get_Invoice_ID(request.params.ItemNum).then((result) => {
    response.json(result[0]);
  });
});

router
  .route("/getLocationExist/:Dept_ID/:Location")
  .get((request, response) => {
    dboperations
      .get_Exist_Location(request.params.Dept_ID, request.params.Location)
      .then((result) => {
        response.json(result[0]);
      });
  });
router.route("/getEmployeePermission/:Cashier_ID").get((request, response) => {
  dboperations
    .get_Empoloyee_Permission(
      request.params.Cashier_ID,
      request.params.Location
    )
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/loginEmployee/:Cashier_ID").get((request, response) => {
  dboperations.login_Employee(request.params.Cashier_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getAllEmployee").get((request, response) => {
  dboperations.get_All_Employee().then((result) => {
    response.json(result[0]);
  });
});

router.route("/getpurchaseorder/:POType").get((request, response) => {
  dboperations.get_Purchase_Orders(request.params.POType).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getpurchaseorderID").get((request, response) => {
  dboperations.get_PO_Number().then((result) => {
    response.json(result[0]);
  });
});

router.route("/getpurchaseorderitems/:PO_Number").get((request, response) => {
  dboperations
    .get_Purchase_Orders_Items(request.params.PO_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getpounique/:PO_Number").get((request, response) => {
  dboperations
    .get_Purchase_Orders_Unique(request.params.PO_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getvendoritems/:Vendor_Number").get((request, response) => {
  dboperations.get_Vendor_Items(request.params.Vendor_Number).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getvendoritemsAll").get((request, response) => {
  dboperations.get_Vendor_Items_All().then((result) => {
    response.json(result[0]);
  });
});

router.route("/getvendoritemsByItems/:ItemNum").get((request, response) => {
  dboperations
    .get_Vendor_Items_Assign(request.params.ItemNum)
    .then((result) => {
      response.json(result[0]);
    });
});

router
  .route("/checkExistsTagAlong/:ItemNum/:TagAlong_ItemNum")
  .get((request, response) => {
    dboperations
      .Check_Exists_Tag_Along_Items(
        request.params.ItemNum,
        request.params.TagAlong_ItemNum
      )
      .then((result) => {
        response.json(result[0]);
      });
  });

router
  .route("/getvendoritemsbyItemNum/:Vendor_Number/:ItemNum")
  .get((request, response) => {
    dboperations
      .get_Vendor_Items_By_ItemNum(
        request.params.Vendor_Number,
        request.params.ItemNum
      )
      .then((result) => {
        response.json(result[0]);
      });
  });

router.route("/getitemizedID/:Invoice_Number").get((request, response) => {
  dboperations
    .get_Itemized_LineNum(request.params.Invoice_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getReorderCount").get((request, response) => {
  dboperations
    .get_ReorderLevel_Count(request.params.Invoice_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getLowStockCount").get((request, response) => {
  dboperations
    .get_LowStockLevel_Count(request.params.Invoice_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getTotalLotterySale").get((request, response) => {
  dboperations
    .get_Total_Lottery_Sales(request.params.Invoice_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getinventorysetupid").get((request, response) => {
  dboperations
    .get_Setup_TS_Buttons_Index(request.params.ItemNum)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/reasoncodes/:Reason_Type").get((request, response) => {
  dboperations.getReasonCodes(request.params.Reason_Type).then((result) => {
    response.json(result[0]);
  });
});

router.route("/orders").post((request, response) => {
  let order = { ...request.body };

  dboperations.addOrder(order).then((result) => {
    response.status(201).json(result);
  });
});

router.route("/createbarcode").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .CreacteBarcode(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createkitindex").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_Kit_Index(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/updatepodetails").post((request, response) => {
  let poDetails = { ...request.body };

  // Check if the poDetails are provided
  if (!poDetails || Object.keys(poDetails).length === 0) {
    return response.status(400).json({
      message: "PO details are required.",
    });
  }

  // Assuming `dboperations.Update_PO_Details` is an async function that returns a Promise
  dboperations
    .Update_PO_Details(poDetails)
    .then((result) => {
      // If the PO update is successful, send a 200 response
      response.status(200).json({
        message: "PO details updated successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error updating PO details:", error);
      response.status(500).json({
        message: "An error occurred while updating PO details.",
        error: error.message || error,
      });
    });
});

router.route("/createreasoncode").post((request, response) => {
  let reasonDetails = { ...request.body };

  // Check if the reasonDetails are provided
  if (!reasonDetails || Object.keys(reasonDetails).length === 0) {
    return response.status(400).json({
      message: "Reason details are required.",
    });
  }

  // Assuming `dboperations.Create_Reason_Code` is an async function that returns a Promise
  dboperations
    .Create_Reason_Code(reasonDetails)
    .then((result) => {
      // If the reason code creation is successful, send a 201 response
      response.status(201).json({
        message: "Reason code created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating reason code:", error);
      response.status(500).json({
        message: "An error occurred while creating the reason code.",
        error: error.message || error,
      });
    });
});

router.route("/createinvedors").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_Inventory_Vendor(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createtagalongs").post((request, response) => {
  let tagAlongDetails = { ...request.body };

  // Check if the tagAlongDetails are provided
  if (!tagAlongDetails || Object.keys(tagAlongDetails).length === 0) {
    return response.status(400).json({
      message: "TagAlong details are required.",
    });
  }

  // Assuming `dboperations.create_Inventory_TagAlongs` is an async function that returns a Promise
  dboperations
    .create_Inventory_TagAlongs(tagAlongDetails)
    .then((result) => {
      // If the TagAlong creation is successful, send a 201 response
      response.status(201).json({
        message: "TagAlong created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating TagAlong:", error);
      response.status(500).json({
        message: "An error occurred while creating the TagAlong.",
        error: error.message || error,
      });
    });
});

router.route("/createvendor").post((request, response) => {
  let vendorDetails = { ...request.body };

  // Check if the vendorDetails are provided
  if (!vendorDetails || Object.keys(vendorDetails).length === 0) {
    return response.status(400).json({
      message: "Vendor details are required.",
    });
  }

  // Assuming `dboperations.Create_Vendor` is an async function that returns a Promise
  dboperations
    .Create_Vendor(vendorDetails)
    .then((result) => {
      // If the vendor creation is successful, send a 201 response
      response.status(201).json({
        message: "Vendor created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating vendor:", error);
      response.status(500).json({
        message: "An error occurred while creating the vendor.",
        error: error.message || error,
      });
    });
});

router.route("/createaltskus").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_Inventory_SKUS(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createinventoryref").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_Inventory_Reference(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createinventoryaddit").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_Inventory_AdditionalInfo(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createbumbar").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_BumpBarSettings(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createsetupts").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .Create_Setup_TS_Buttons(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createinvetoryin").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .CreacteInventory_In(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createinvoicetotal").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // console.log(barcodeDetails);

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .createInvoiceTotals(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "success",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createitemized").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .createInvoiceItemized(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createpodetails").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .createPODetail(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createpurchaseorder").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .createPOSummary(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Barcode created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/createonhold").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .createInvoiceOnHold(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "success",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating barcode:", error);
      response.status(500).json({
        message: "An error occurred while creating the barcode.",
        error: error.message || error,
      });
    });
});

router.route("/inventorywithref").post(async (request, response) => {
  try {
    const {
      inventoryData,
      additionalInfoData,
      setupTsButtonData,
      InventoryRefData,
      InventoryBumpbarData,
    } = request.body;

    // Call the function to insert inventory data into the database
    await dboperations.Create_Inventory_Entry(
      inventoryData,
      additionalInfoData,
      setupTsButtonData,
      InventoryRefData,
      InventoryBumpbarData
    );

    response.status(200).send("Inventory created successfully!");
  } catch (error) {
    console.error(error);
    response.status(500).send("Error creating inventory");
  }
});

router.route("/createAltSKU").post(async (request, response) => {
  try {
    // Validate input data
    const { Store_ID, ItemNum, AltSKU } = request.body;

    if (!Store_ID || !ItemNum || !AltSKU) {
      return response.status(400).send({
        success: false,
        message:
          "Invalid input data. Please provide Store_ID, ItemNum, and AltSKU.",
      });
    }

    // Call the function to insert inventory data
    const result = await dboperations.Create_Inventory_SKUS(request.body);

    // Respond with success
    console.log("Alt SKU created successfully");
    return response.status(200).send({
      success: true,
      message: "Alt SKU created successfully",
      data: result,
    });
  } catch (error) {
    // Return error response

    return response.status(500).send({
      success: false,
      message: error.message || "Error creating Alt SKU",
    });
  }
});

router.route("/createchoiceitem").post((request, response) => {
  let barcodeDetails = { ...request.body };

  // Check if the barcodeDetails are provided
  if (!barcodeDetails || Object.keys(barcodeDetails).length === 0) {
    return response.status(400).json({
      message: "Barcode details are required.",
    });
  }

  // Assuming `dboperations.CreateBarcode` is an async function that returns a Promise
  dboperations
    .CreacteChoiceItem(barcodeDetails)
    .then((result) => {
      // If the barcode creation is successful, send a 201 response
      response.status(201).json({
        message: "Item created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating Item:", error);
      response.status(500).json({
        message: "An error occurred while creating the Item.",
        error: error.message || error,
      });
    });
});

router.route("/updatebarcode").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .UpdateBarcode(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updateemployee").put((request, response) => {
  let employeeDetails = { ...request.body };

  dboperations
    .UpdateEmployee(employeeDetails)
    .then((result) => {
      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Employee updated successfully" });
      } else {
        // If no rows were affected (employee not found or no changes made)
        response
          .status(404)
          .json({ message: "Employee not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating employee:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the employee",
        error: error.message,
      });
    });
});

router.route("/updateinvoice").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .updateInvoiceTotals(barcodeDetails)
    .then((result) => {
      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updatepodetails").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .UpdatePODetails(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updateinvoiecitemized").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .UpdateInvoiceItemized(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updatecountitem").put((request, response) => {
  let { ItemData } = request.body;

  // console.log(ItemData);

  // Call the database operation to update the item count
  dboperations
    .updateCountItems(ItemData)
    .then((result) => {
      // If the update is successful, send a success response
      response.status(200).json({
        message: "Item count updated successfully",
        data: result,
      });
    })
    .catch((error) => {
      // If an error occurs, send an error response
      response.status(500).json({
        message: "Error updating item count",
        error: error.message,
      });
    });
});

router.route("/updatekitindex").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .UpdateKitIndex(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updateinventoryadditionalinfo").put((request, response) => {
  let itemData = { ...request.body };

  dboperations
    .UpdateInventoryAdditionalInfo(itemData)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response
          .status(200)
          .json({ message: "Inventory additional info updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating inventory additional info:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message:
          "An error occurred while updating the inventory additional info",
        error: error.message,
      });
    });
});

router.route("/createdepartment").post((request, response) => {
  let departmentDetails = { ...request.body };

  // Check if the departmentDetails are provided
  if (!departmentDetails || Object.keys(departmentDetails).length === 0) {
    return response.status(400).json({
      message: "Department details are required.",
    });
  }

  // Assuming `dboperations.Create_Department_Index` is an async function that returns a Promise
  dboperations
    .Create_Department_Index(departmentDetails)
    .then((result) => {
      // If the department creation is successful, send a 201 response
      response.status(201).json({
        message: "Department created successfully.",
        data: result,
      });
    })
    .catch((error) => {
      // Handle any errors that occur during the database operation
      console.error("Error creating department:", error);
      response.status(500).json({
        message: "An error occurred while creating the department.",
        error: error.message || error,
      });
    });
});

router.route("/updatePoSummary").put((request, response) => {
  let barcodeDetails = { ...request.body };

  // console.log(barcodeDetails);

  dboperations
    .UpdatePO_Summary(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updateinvetoryadjust").put((request, response) => {
  let barcodeDetails = { ...request.body };

  dboperations
    .UpdateInventoryAdjust(barcodeDetails)
    .then((result) => {
      // Debugging: Log the result to see the exact structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rows
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response.status(200).json({ message: "Item updated successfully" });
      } else {
        // If no rows were affected (item not found or no changes made)
        response
          .status(404)
          .json({ message: "Item not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debugging
      console.error("Error updating item:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the item",
        error: error.message,
      });
    });
});

router.route("/updateinventoryvendors").put((request, response) => {
  let vendorDetails = { ...request.body };

  dboperations
    .UpdateInventoryVendors(vendorDetails)
    .then((result) => {
      // Debugging: Log the result to check the structure of the response
      ////console.log(result);

      // Check if rowsAffected exists and if it affected any rowsds
      if (result && result.rowsAffected && result.rowsAffected[0] > 0) {
        // If the update was successful
        response
          .status(200)
          .json({ message: "Vendor information updated successfully" });
      } else {
        // If no rows were affected (vendor not found or no changes made)
        response
          .status(404)
          .json({ message: "Vendor not found or no changes made" });
      }
    })
    .catch((error) => {
      // Log any errors for debuggingd
      console.error("Error updating vendor:", error);

      // Return error message with a 500 status code
      response.status(500).json({
        message: "An error occurred while updating the vendor",
        error: error.message,
      });
    });
});

router.route("/GetDepartments").get((request, response) => {
  dboperations.getDepartments().then((result) => {
    response.json(result[0]);
  });
});

router.route("/GetKidIndex/:Kit_ID").get((request, response) => {
  dboperations.getKidIndexList(request.params.Kit_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/GetInvoiceTotal/:Invoice_Number").get((request, response) => {
  dboperations
    .get_Invoice_Totals(request.params.Invoice_Number)
    .then((result) => {
      response.json(result[0]);
    });
});

router
  .route("/GetInvoiceTotalExists/:Orig_OnHoldID")
  .get((request, response) => {
    dboperations
      .get_Invoice_Totals_Exists(request.params.Orig_OnHoldID)
      .then((result) => {
        response.json(result[0]);
      });
  });

router.route("/getExistDepartments/:Dept_ID").get((request, response) => {
  dboperations.get_Department_Exists(request.params.Dept_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/GetViewAltSKUS/:ItemNum").get((request, response) => {
  dboperations.getViewAltSKU(request.params.ItemNum).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getUnitAltSKU/:ItemNum/:AltSKU").get((request, response) => {
  dboperations
    .getUnitAltSKU(request.params.ItemNum, request.params.AltSKU)
    .then((result) => {
      response.json(result[0]);
    });
});

router.route("/getinvoicehold").get((request, response) => {
  dboperations.getInvoiceOnHold().then((result) => {
    response.json(result[0]);
  });
});

router.route("/getInventoryAdditional/:ItemNum").get((request, response) => {
  dboperations.getInventoryAdditional(request.params.ItemNum).then((result) => {
    response.json(result[0]);
  });
});

router.route("/getInventoryFilter").get((request, response) => {
  dboperations.getInventoryFilter().then((result) => {
    response.json(result[0]);
  });
});

router
  .route("/getInventoryFilterBy_BrandOrCategory")
  .get((request, response) => {
    dboperations.getInventoryFilter_BrandOrCategory().then((result) => {
      response.json(result[0]);
    });
  });

router
  .route("/getinvoiceholditems/:Invoice_Number")
  .get((request, response) => {
    dboperations
      .getInvoiceOnHoldItems(request.params.Invoice_Number)
      .then((result) => {
        response.json(result[0]);
      });
  });

router.route("/getInvoice/:Invoice_Number").get((request, response) => {
  dboperations.getInvoice(request.params.Invoice_Number).then((result) => {
    response.json(result[0]);
  });
});

router.route("/Get_Inventory_KidIndex/:Kit_ID").get((request, response) => {
  dboperations.getInventory_KidIndex(request.params.Kit_ID).then((result) => {
    response.json(result[0]);
  });
});

router.route("/GetVendors").get((request, response) => {
  dboperations.getVendors().then((result) => {
    response.json(result[0]);
  });
});

router.route("/GetTagalong/:ItemNum").get((request, response) => {
  dboperations.get_Tag_Along_Items(request.params.ItemNum).then((result) => {
    response.json(result[0]);
  });
});

router
  .route("/DeleteKitIndex/:Kit_ID/:ItemNum")
  .delete(async (request, response) => {
    const { Kit_ID, ItemNum } = request.params;
    // console.log( Kit_ID, ItemNum);

    try {
      const result = await dboperations.DeleteKidIndex(Kit_ID, ItemNum);
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

router
  .route("/DeleteOnHold/:Invoice_Number")
  .delete(async (request, response) => {
    const { Invoice_Number } = request.params;
    // console.log( Invoice_Number);

    try {
      const result = await dboperations.DeleteOnHold(Invoice_Number);
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

router
  .route("/DeleteReasonCode/:Reason_Type/:Reason_Code")
  .delete(async (request, response) => {
    const { Reason_Type, Reason_Code } = request.params;

    try {
      const result = await dboperations.DeleteReasonCode(
        Reason_Type,
        Reason_Code
      );
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

router
  .route("/DeleteAltSku/:ItemNum/:AltSKU")
  .delete(async (request, response) => {
    const { ItemNum, AltSKU } = request.params;

    try {
      const result = await dboperations.DeleteAltSKUS(ItemNum, AltSKU);
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

router
  .route("/DeletePoItems/:PO_Number/:ItemNum")
  .delete(async (request, response) => {
    const { PO_Number, ItemNum } = request.params;
    // console.log( PO_Number, ItemNum);

    try {
      const result = await dboperations.DeletePoItems(PO_Number, ItemNum);
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

router
  .route("/DeleteTagAlone/:ItemNum/:TagAlong_ItemNum")
  .delete(async (request, response) => {
    const { ItemNum, TagAlong_ItemNum } = request.params;

    try {
      const result = await dboperations.DeleteTagAlong(
        ItemNum,
        TagAlong_ItemNum
      );
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

router
  .route("/DeleteOnHoldItems/:Invoice_Number/:ItemNum")
  .delete(async (request, response) => {
    const { Invoice_Number, ItemNum } = request.params;

    try {
      const result = await dboperations.DeleteOnHoldItems(
        Invoice_Number,
        ItemNum
      );
      if (result) {
        response
          .status(200)
          .json({ success: true, message: "Item deleted successfully" });
      } else {
        response
          .status(404)
          .json({ success: false, message: "Item not found" });
      }
    } catch (error) {
      response.status(500).json({
        success: false,
        message: "An error occurred",
        error: error.message,
      });
    }
  });

const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/inventory`);
  if (process.send) process.send({ status: "started", port: PORT });
});

process.on("NURPOS", () => {
  server.close(() => console.log("Server shutting down"));
});
