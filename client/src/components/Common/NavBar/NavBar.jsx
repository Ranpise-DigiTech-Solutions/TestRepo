/* eslint-disable react-hooks/exhaustive-deps */
import "./NavBar.scss";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { onAuthStateChanged } from "firebase/auth";

import HomeIcon from "@mui/icons-material/Home";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import useMediaQuery from "@mui/material/useMediaQuery";
import LogoutIcon from "@mui/icons-material/Logout";
import { Images } from "../../../constants/index.js";
import {
  UserAuthDialog,
  RegistrationForm,
  WalkInCustomerBookingDialog,
} from "../index.js";
import { firebaseAuth } from "../../../firebaseConfig.js";
import {
  userInfoActions,
  userAuthStateChangeFlag,
} from "../../../states/UserInfo/index.js";
import axios from "axios";
// import { SignedIn, SignedOut, UserButton} from "@clerk/clerk-react";

export default function NavBar({ setIsLoading }) {
  const [scrolled, setScrolled] = useState(false);
  const [isSignInDialogOpen, setSignInDialogOpen] = useState(false);
  const [isRegistrationDialogOpen, setIsRegistrationDialogOpen] =
    useState(false);
  const [
    isWalkInCustomerBookingDialogOpen,
    setIsWalkInCustomerBookingDialogOpen,
  ] = useState(false);
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [user, setUser] = useState(null);
  const userInfoStore = useSelector((state) => state.userInfo);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hallData, setHallData] = useState(null);
  const [serviceProviderData, setServiceProviderData] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleUserProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserProfileClose = () => {
    setAnchorEl(null);
  };

  const handleSignInButtonClick = () => {
    setSignInDialogOpen(true);
  };

  const handleSignInDialogClose = () => {
    setSignInDialogOpen(false);
  };
  const handleRegistrationDialogOpen = () => {
    setIsRegistrationDialogOpen(true);
  };

  const handleRegistrationDialogClose = () => {
    setIsRegistrationDialogOpen(false);
  };
  // Function to toggle the mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  // Function to handle menu item clicks
  const handleMenuItemClick = (componentKey) => {
    console.log(componentKey);
    // Add any additional functionality you need
  };
  const handleWalkInCustomerBookingDialogClose = () => {
    setIsWalkInCustomerBookingDialogOpen(false);
  };

  const handleWalkInCustomerBookingDialogOpen = () => {
    setIsWalkInCustomerBookingDialogOpen(true);
  };

  const handleLogout = async () => {
    try {
      await firebaseAuth.signOut(); // Sign out the current user
      dispatch(userInfoActions("userDetails", {}));
      setUser(null);
      console.log("User logged out successfully");
    } catch (error) {
      // Handle Error condition
      console.error("Error logging out:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log("ENTERED_SIGNIN", currentUser);
      if (currentUser) {
        console.log("currentUser", currentUser.uid);
        setUser(currentUser);
        // setIsLoading(true);

        const getUserData = async () => {
          try {
            const response = await axios.get(
              `${
                import.meta.env.VITE_SERVER_URL
              }/eventify_server/userAuthentication/getUserData/${
                currentUser.uid
              }`
            );
            dispatch(userInfoActions("userDetails", response.data));
          } catch (error) {
            console.error("Error fetching user data:", error.message);
          } finally {
            // setIsLoading(false);
          }
        };
        console.log("FUNCTION CALL");
        getUserData();
      } else {
        // No user is signed in
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [dispatch, userInfoStore.userAuthStateChangeFlag]); // dependency array => [userAuthStateChangeFlag]

  // get hall data
  useEffect(() => {
    if (userInfoStore.userDetails.vendorType !== "Banquet Hall") {
      return;
    }

    try {
      const getServiceProviderData = async (hallData) => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/serviceProviderMaster/?serviceProviderId=${
            hallData.hallUserId
          }`
        );
        setServiceProviderData(response.data[0]);
      };

      const getHallData = async () => {
        const response = await axios.get(
          `${
            import.meta.env.VITE_SERVER_URL
          }/eventify_server/hallMaster/getHallByUserId/?userId=${
            userInfoStore.userDetails.Document._id
          }`
        );
        setHallData(response.data[0]);
        getServiceProviderData(response.data[0]);
        setIsLoading(false);
      };

      if (userInfoStore.userDetails.Document !== undefined) {
        getHallData();
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  }, [user, userInfoStore.userDetails]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > prevScrollY) {
        // Scrolling down, hide the navbar
        setScrolled(false);
      } else {
        // Scrolling up, show the navbar
        setScrolled(true);
      }

      // Update the previous scroll position
      setPrevScrollY(currentScrollY);
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollY]);

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div className="navbar__container">
      <div className={`navbar__wrapper ${scrolled ? "scrolled" : ""}`}>
        <div className="logo__wrapper">
          <img src={Images.logo} alt="logo" className="logo" />
          <div className="logodescription">
            <p className="title">EventifyConnect</p>
            <p className="tagline">- Connecting people together</p>
          </div>
        </div>
        {isMobile ? (
          // Mobile view
          <div>
            <IconButton onClick={toggleMobileMenu} color="inherit">
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
            <Drawer
              anchor="right"
              open={mobileMenuOpen}
              onClose={toggleMobileMenu}
            >
              <Box
                sx={{
                  width: 250,
                  height: "100vh",
                  bgcolor: "#1A1A1A", // Set the background color to red
                  color: "#fff", // Set the text color to white
                }}
                role="presentation"
                onClick={toggleMobileMenu}
                onKeyDown={toggleMobileMenu}
              >
                {user ? (
                  <Box
                    className="navbarDrawer__container"
                    sx={{
                      height: "100%",
                      width: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                    }}
                  >
                    <List sx={{ width: "100%" }}>
                      <ListItem key={"profilePic"} disablePadding>
                        <ListItemButton>
                          <ListItemIcon
                            sx={{
                              height: "2rem",
                              width: "2rem",
                              borderRadius: "999px",
                            }}
                          >
                            <Box
                              component={"img"}
                              src={
                                userInfoStore.userDetails.userType ===
                                "CUSTOMER"
                                  ? userInfoStore.userDetails?.Document
                                      ?.customerProfileImage
                                  : userInfoStore.userDetails?.Document
                                      ?.vendorProfileImage
                              }
                              alt="profile pic"
                              sx={{
                                height: "2.25rem",
                                width: "2.5rem",
                                borderRadius: "999px",
                              }}
                              className="profilePic"
                            />
                          </ListItemIcon>
                          <p className="logoText">
                            {userInfoStore.userDetails.userType === "CUSTOMER"
                              ? userInfoStore.userDetails?.Document
                                  ?.customerName
                              : userInfoStore.userDetails?.Document?.vendorName}
                          </p>
                        </ListItemButton>
                      </ListItem>
                      <Divider
                        className="divider"
                        sx={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#b3b3b3",
                          margin: "0.5rem 0",
                        }}
                      />
                      <ListItem key={"Home"} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <HomeIcon
                              sx={{ color: "#007bff" }}
                              className="icon"
                            />
                          </ListItemIcon>
                          <p className="listItemText">Home</p>
                        </ListItemButton>
                      </ListItem>
                      <Link to="/user-profile" className="profile-link">
                        <ListItem key={"Account"} disablePadding>
                          <ListItemButton>
                            <ListItemIcon>
                              <PersonIcon
                                sx={{ color: "#007bff" }}
                                className="icon"
                              />
                            </ListItemIcon>
                            <p className="listItemText">My Account</p>
                          </ListItemButton>
                        </ListItem>
                      </Link>
                      {userInfoStore.userDetails?.userType === "VENDOR" &&
                        userInfoStore.userDetails?.vendorType ===
                          "Banquet Hall" && (
                          <ListItem
                            key={"Account"}
                            onClick={handleWalkInCustomerBookingDialogOpen}
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemIcon>
                                <AddBusinessOutlinedIcon
                                  sx={{ color: "#007bff" }}
                                  className="icon"
                                />
                              </ListItemIcon>
                              <p className="listItemText">Walk-In Booking</p>
                            </ListItemButton>
                          </ListItem>
                        )}
                    </List>
                    <List className="list__wrapper" sx={{ width: "100%" }}>
                      <Divider
                        className="divider"
                        sx={{
                          width: "100%",
                          height: "1px",
                          backgroundColor: "#b3b3b3",
                          margin: "0",
                        }}
                      />
                      <ListItem
                        key={"Add Account"}
                        onClick={handleLogout}
                        disablePadding
                      >
                        <ListItemButton>
                          <ListItemIcon>
                            <PersonAdd
                              sx={{ color: "#007bff" }}
                              className="icon"
                            />
                          </ListItemIcon>
                          <p className="listItemText">Add Account</p>
                        </ListItemButton>
                      </ListItem>
                      <Link
                        to={{
                          pathname: "/user-profile",
                          search: `?activeComponent=Settings`,
                        }}
                      >
                        <ListItem
                          key={"Settings"}
                          onClick={handleLogout}
                          disablePadding
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <Settings
                                sx={{ color: "#007bff" }}
                                className="icon"
                              />
                            </ListItemIcon>
                            <p className="listItemText">Settings</p>
                          </ListItemButton>
                        </ListItem>
                      </Link>
                      <Link to="/">
                        <ListItem
                          key={"Logout"}
                          onClick={handleLogout}
                          disablePadding
                        >
                          <ListItemButton>
                            <ListItemIcon>
                              <LogoutIcon
                                sx={{ color: "#007bff" }}
                                className="icon"
                              />
                            </ListItemIcon>
                            <p className="listItemText">Logout</p>
                          </ListItemButton>
                        </ListItem>
                      </Link>
                    </List>
                  </Box>
                ) : (
                  <List>
                    {/* Add your menu items here */}
                    <ListItem onClick={() => handleMenuItemClick("venues")}>
                      <a href="#destinations" className="tag">
                        Venues
                      </a>
                    </ListItem>
                    <ListItem onClick={() => handleMenuItemClick("ourValue")}>
                      <a href="#aboutUs" className="tag">
                        Our Value
                      </a>
                    </ListItem>
                    <ListItem onClick={() => handleMenuItemClick("contactUs")}>
                      <a href="#footer" className="tag">
                        Contact Us
                      </a>
                    </ListItem>
                    <ListItem onClick={() => handleMenuItemClick("getStarted")}>
                      <a
                        href="#searchBar"
                        className="tag"
                      >
                        Get Started
                      </a>
                    </ListItem>
                    <ListItem 
                      onClick={handleSignInButtonClick}
                      sx={{ cursor: "pointer" }}  
                    >
                      <ListItemIcon sx={{ color: "#ffffff", }}>
                        <PersonAdd fontSize="small" />
                      </ListItemIcon>
                      <p className="listItemText">Sign In</p>
                    </ListItem>
                  </List>
                )}
              </Box>
            </Drawer>
          </div>
        ) : (
          <div className="tags__wrapper">
            <a
              href="#destinations"
              className="tag"
              onClick={() => handleMenuItemClick("venues")}
            >
              Venues
            </a>
            <a
              href="#aboutUs"
              className="tag"
              onClick={() => handleMenuItemClick("ourValue")}
            >
              Our Value
            </a>
            <a
              href="#footer"
              className="tag"
              onClick={() => handleMenuItemClick("contactUs")}
            >
              Contact Us
            </a>
            <a
              href="#searchBar"
              className="tag"
              onClick={() => handleMenuItemClick("getStarted")}
            >
              Get Started
            </a>
            {user ? (
              <React.Fragment>
                <Tooltip title="Account settings">
                  <IconButton
                    onClick={handleUserProfileClick}
                    size="small"
                    sx={{ ml: 2 }}
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    className="userProfile"
                  >
                    <Avatar sx={{ width: 36, height: 36 }}>M</Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleUserProfileClose}
                  onClick={handleUserProfileClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Link to="/">
                    <MenuItem>
                      <ListItemIcon>
                        <HomeIcon fontSize="small" />
                      </ListItemIcon>
                      Home
                    </MenuItem>
                  </Link>
                  <Divider />
                  <Link to="/user-profile" className="profile-link">
                    <MenuItem>
                      <ListItemIcon>
                        <div className="avatar-wrapper">
                          <Avatar fontSize="small" />
                        </div>
                      </ListItemIcon>
                      My Account
                    </MenuItem>
                  </Link>
                  <Divider />

                  {userInfoStore.userDetails.userType === "VENDOR" &&
                    userInfoStore.userDetails.vendorType === "Banquet Hall" && (
                      <MenuItem onClick={handleWalkInCustomerBookingDialogOpen}>
                        <ListItemIcon>
                          <AddBusinessOutlinedIcon fontSize="small" />
                        </ListItemIcon>
                        Walk-In Customer
                      </MenuItem>
                    )}
                  <Divider />
                  <MenuItem>
                    <ListItemIcon>
                      <PersonAdd fontSize="small" />
                    </ListItemIcon>
                    Add another account
                  </MenuItem>
                  <Link
                    to={{
                      pathname: "/user-profile",
                      search: `?activeComponent=Settings`,
                    }}
                  >
                    <MenuItem onClick={handleUserProfileClose}>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                  </Link>
                  <MenuItem
                    onClick={() => {
                      handleUserProfileClose();
                      handleLogout();
                    }}
                  >
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </React.Fragment>
            ) : (
              <Button
                variant="contained"
                className="button"
                onClick={handleSignInButtonClick}
              >
                Sign In
              </Button>
            )}
          </div>
        )}
      </div>
      {isSignInDialogOpen && (
        <div className="signInDialog">
          <UserAuthDialog
            open={isSignInDialogOpen}
            handleClose={handleSignInDialogClose}
            handleRegistrationDialogOpen={handleRegistrationDialogOpen}
          />
        </div>
      )}
      {isRegistrationDialogOpen && (
        <div className="userRegistrationDialog">
          <RegistrationForm
            open={isRegistrationDialogOpen}
            handleClose={handleRegistrationDialogClose}
            // userType={"VENDOR"}
            // vendorType={"Banquet Hall"}
          />
        </div>
      )}
      {isWalkInCustomerBookingDialogOpen && (
        <div className="walkInCustomerBookingDialog">
          <WalkInCustomerBookingDialog
            open={isWalkInCustomerBookingDialogOpen}
            handleClose={handleWalkInCustomerBookingDialogClose}
            hallData={hallData}
            serviceProviderData={serviceProviderData}
          />
        </div>
      )}
    </div>
  );
}

NavBar.propTypes = {
  setIsLoading: PropTypes.func,
  hallData: PropTypes.object,
  serviceProviderData: PropTypes.object,
};
