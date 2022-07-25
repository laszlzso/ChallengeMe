import React, { createRef, FC, useEffect, useRef, useState } from "react";
import {
  Avatar as MuiAvatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Tooltip,
  Typography
} from "@mui/material";
import { useAuthContext } from "../authProvider/AuthProvider";
import Image from "next/image";

const settings = ["Profile", "Logout"];

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(100%, 600px)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const Avatar: FC = () => {
  const { user, logoutUser } = useAuthContext();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (setting: string) => {
    switch (setting) {
      case "Profile":
        setProfileOpen(true);
        break;
      case "Logout":
        logoutUser();
        break;
    }
    setAnchorElUser(null);
  };

  const handleFileSelected = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event);
    debugger;
  };

  return (
    <>
      <Tooltip title="">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <MuiAvatar
            alt={user?.username}
            src="https://mui.com/static/images/avatar/2.jpg"
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right"
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem key={setting} onClick={() => handleCloseUserMenu(setting)}>
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
      <Modal open={profileOpen} onClose={() => setProfileOpen(false)}>
        <Box sx={style}>
          <Typography variant="h2" component="h2">
            {`${user?.username} (${user?.user_id})`}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Image
              src="https://mui.com/static/images/avatar/2.jpg"
              width={400}
              height={400}
              alt={user?.username}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" component="label">
              Upload
              <input
                onChange={handleFileSelected}
                hidden
                accept="image/*"
                type="file"
              />
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default Avatar;
