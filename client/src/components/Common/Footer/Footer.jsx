import "./Footer.scss"; // Import your custom styles for the footer
import React, { useState } from "react";
import { Link } from 'react-router-dom';

import Dialog from "@mui/material/Dialog";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from '@mui/icons-material/X';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

import { ContactForm, AlertDialogSlide } from "../../../sub-components";
import { Images } from "../../../constants";

export default function Footer() {

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [openDialog, setOpenDialog] = useState(false);
  const [openSendMessageDialog, setOpenSendMessageDialog] = useState(false); 
  const [isMessageSent, setIsMessageSent] = useState(false); // to toggle snackBar

  const constructionMessage =
    "This section is under construction. We will provide details soon.";
  const handleLinkClick = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSendMessageDialogOpen = ()=> {
    setOpenSendMessageDialog(true);
  }

  const handleSendMessageDialogClose = ()=> {
    setOpenSendMessageDialog(false);
  }

  const handleSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsMessageSent(false);
  };

  const snackBarAction = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleSnackBarClose}>
        Un-Send
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleSnackBarClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const mapLink =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3766.5045085375023!2d73.1332210737419!3d19.260414546160078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be796881823811b%3A0xc9e1a4474c36940c!2sRanpise%20DigiTech%20Solutions%20Private%20Limited!5e0!3m2!1sen!2sin!4v1711347263461!5m2!1sen!2sin";

  return (
    <div className="footer__container" id="footer">
      <Snackbar
        open={isMessageSent}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Thank you for connecting! We'll get back to you soon!!"
        action={snackBarAction}
      />
      <Dialog
        fullScreen={fullScreen}
        open={openSendMessageDialog}
        onClose={handleSendMessageDialogClose}
        aria-labelledby="responsive-dialog-title"
        aria-describedby="responsive-dialog-description"
        maxWidth="sm"
        fullWidth
      >
        <div className="sendMessageDialog__wrapper" style={{padding: "2rem", backgroundColor: "#333333"}}>
          <ContactForm setIsSuccess={setIsMessageSent}/>
        </div>
      </Dialog>
      <div className="company__logo">
        <h2>EventifyConnect</h2>
      </div>
      <div className="wrapper_1">
        <div className="sub__wrapper_1">
          <div className="links">
            <div className="link__grp_1">
              <p onClick={handleLinkClick}>Our Blog</p>
              <p onClick={handleLinkClick}>Our Service</p>
              <p>FAQs</p>
              <p>
                <a href="#contact-form" onClick={handleSendMessageDialogOpen}>Contact Us</a>
              </p>
            </div>
            <div className="link__grp_2">
              <p><a href="#aboutUs">About Us</a></p>
              <p><Link to="/careers">Careers</Link></p>
              <p><Link to="/privacy-policy">Privacy Policy</Link></p>
              <p><Link to="/cancellation-refund-policy">Cancellation Policy</Link></p>
              <p><Link to="/terms-and-conditions">Terms and Conditions</Link></p>
            </div>
          </div>
          <div className="icons">
            <FacebookIcon className="icon" />
            <InstagramIcon className="icon" />
            <XIcon className="icon" />
            <LinkedInIcon className="icon" />
            <PinterestIcon className="icon" />
          </div>
          <div className="app_icon_description">
            {" "}
            For better experience, download the eventifyConnect app now
          </div>
          <div className="app__download__icons">
            <a href="https://play.google.com/store/apps/details?id=YOUR_APP_PACKAGE_NAME">
              <img
                src={Images.PlayStoreIcon}
                alt="Download from Play Store"
                className="playstore"
              />
            </a>
            <a href="https://apps.apple.com/YOUR_APP_STORE_LINK">
              <img
                src={Images.AppStoreIcon}
                alt="Download from App Store"
                className="appstore"
              />
            </a>
          </div>
        </div>
        <div className="sub__wrapper_middle">
          <div id="map-container">
            <iframe
              src={mapLink}
              width="370"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div className="operating-hours">
            <p> Open Hour 9.30 AM - 6.30 PM</p>
          </div>
        </div>
      </div>
      <div className="wrapper_2">
        <div className="line__separator"></div>
        <div className="copyright__info">
          <p>Copyright &copy;2024 All rights reserved</p>
          <p>Made by Ranpise DigiTech Solutions</p>
        </div>
      </div>
      <AlertDialogSlide
        open={openDialog}
        handleClose={handleCloseDialog}
        message={constructionMessage}
      />
    </div>
  );
}
