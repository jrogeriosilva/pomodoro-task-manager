import React, { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Alert,
} from "@mui/material";
import { useApp } from "../../context/AppContext";
import { useStore } from "../../hooks/useStore";
import { StoreItem, TaskTemplate } from "../../types";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`store-tabpanel-${index}`}
      aria-labelledby={`store-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

export function StoreScreen() {
  const { tomatoPoints, spendTomatoPoints, setViewMode, addTask } = useApp();
  const { 
    inventory, 
    storeItems, 
    taskTemplates, 
    purchaseItem, 
    useConsumableItem, 
    hasItem, 
    getItemQuantity 
  } = useStore();

  const [tabValue, setTabValue] = useState(0);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [purchaseDialog, setPurchaseDialog] = useState(false);
  const [templateDialog, setTemplateDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const powerUpItems = storeItems.filter(item => item.category === "powerups");
  const utilityItems = storeItems.filter(item => item.category === "utility");

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePurchase = () => {
    if (!selectedItem) return;

    const success = purchaseItem(selectedItem.id, spendTomatoPoints);
    
    if (success) {
      setAlertMessage(`Successfully purchased ${selectedItem.name}!`);
      setTimeout(() => setAlertMessage(""), 3000);
    } else {
      if (!selectedItem.isConsumable && hasItem(selectedItem.id)) {
        setAlertMessage("You already own this item!");
      } else {
        setAlertMessage("Not enough tomato points!");
      }
      setTimeout(() => setAlertMessage(""), 3000);
    }
    
    setPurchaseDialog(false);
    setSelectedItem(null);
  };

  const handleUseItem = (itemId: string) => {
    const success = useConsumableItem(itemId);
    if (success) {
      setAlertMessage("Item activated successfully!");
    } else {
      setAlertMessage("Failed to use item!");
    }
    setTimeout(() => setAlertMessage(""), 3000);
  };

  const handleUseTemplate = (template: TaskTemplate) => {
    template.tasks.forEach((taskText, index) => {
      addTask(`${template.name} - ${taskText}`, Math.floor(template.totalPomodoros / template.tasks.length) + (index < template.totalPomodoros % template.tasks.length ? 1 : 0));
    });
    
    setAlertMessage(`Created ${template.tasks.length} tasks from ${template.name} template!`);
    setTimeout(() => setAlertMessage(""), 3000);
    setTemplateDialog(false);
    setSelectedTemplate(null);
  };

  const renderItemCard = (item: StoreItem) => {
    const owned = hasItem(item.id);
    const quantity = getItemQuantity(item.id);
    const canAfford = tomatoPoints.total >= item.price;

    return (
      <Card 
        key={item.id}
        sx={{ 
          height: "100%", 
          display: "flex", 
          flexDirection: "column",
          minWidth: 280,
          flex: "1 1 300px",
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 4,
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Typography variant="h3" sx={{ mr: 2 }}>
              {item.icon}
            </Typography>
            <Box>
              <Typography variant="h6" component="h3">
                {item.name}
              </Typography>
              <Chip 
                label={`${item.price} 🍅`} 
                color="primary" 
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1, mb: 2 }}>
            {item.description}
          </Typography>

          {item.isConsumable && quantity > 0 && (
            <Box sx={{ mb: 2 }}>
              <Chip 
                label={`Owned: ${quantity}`} 
                color="success" 
                size="small"
                sx={{ mr: 1 }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={() => handleUseItem(item.id)}
                sx={{ mt: 1 }}
              >
                Use Item
              </Button>
            </Box>
          )}

          {!item.isConsumable && owned && (
            <Chip 
              label="Owned" 
              color="success" 
              size="small"
              sx={{ mb: 2, alignSelf: "flex-start" }}
            />
          )}

          <Button
            variant="contained"
            fullWidth
            disabled={(!item.isConsumable && owned) || !canAfford}
            onClick={() => {
              if (item.id === "task-templates" && owned) {
                setTemplateDialog(true);
              } else {
                setSelectedItem(item);
                setPurchaseDialog(true);
              }
            }}
            sx={{ mt: "auto" }}
          >
            {!item.isConsumable && owned 
              ? (item.id === "task-templates" ? "Use Templates" : "Owned")
              : !canAfford 
                ? "Not Enough Points"
                : "Purchase"
            }
          </Button>
        </CardContent>
      </Card>
    );
  };

  const renderInventorySection = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Active Effects
      </Typography>
      {inventory.activeEffects.length === 0 ? (
        <Typography color="text.secondary">
          No active effects. Purchase power-ups to get started!
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {inventory.activeEffects.map((effect, index) => {
            const item = storeItems.find(i => i.id === effect.itemId);
            return (
              <Card key={index} sx={{ minWidth: 200, flex: "1 1 300px" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Typography variant="h6" sx={{ mr: 1 }}>
                      {item?.icon}
                    </Typography>
                    <Typography variant="subtitle1">
                      {item?.name}
                    </Typography>
                  </Box>
                  <Chip 
                    label={`${effect.remainingUses} uses left`} 
                    color="secondary" 
                    size="small"
                  />
                </CardContent>
              </Card>
            );
          })}
        </Box>
      )}

      {inventory.timeBank > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            Time Bank
          </Typography>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h4" sx={{ mr: 2 }}>🏦</Typography>
                <Box>
                  <Typography variant="h6">
                    {inventory.timeBank} minutes stored
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use during breaks to extend your rest time
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 4 }}>
        <Box>
          <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
            🍅 Tomato Store
          </Typography>
          <Typography variant="h6" color="text.secondary">
            You have {tomatoPoints.total} tomato points
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => setViewMode("taskList")}
        >
          Back to Tasks
        </Button>
      </Box>

      {/* Alert */}
      {alertMessage && (
        <Alert 
          severity={alertMessage.includes("Successfully") || alertMessage.includes("Created") ? "success" : "error"} 
          sx={{ mb: 3 }}
          onClose={() => setAlertMessage("")}
        >
          {alertMessage}
        </Alert>
      )}

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Power-ups" />
          <Tab label="Utility Items" />
          <Tab label="My Inventory" />
        </Tabs>
      </Box>

      {/* Power-ups Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {powerUpItems.map(renderItemCard)}
        </Box>
      </TabPanel>

      {/* Utility Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {utilityItems.map(renderItemCard)}
        </Box>
      </TabPanel>

      {/* Inventory Tab */}
      <TabPanel value={tabValue} index={2}>
        {renderInventorySection()}
      </TabPanel>

      {/* Purchase Confirmation Dialog */}
      <Dialog open={purchaseDialog} onClose={() => setPurchaseDialog(false)}>
        <DialogTitle>Confirm Purchase</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h3" sx={{ mr: 2 }}>
                  {selectedItem.icon}
                </Typography>
                <Box>
                  <Typography variant="h6">
                    {selectedItem.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Cost: {selectedItem.price} 🍅
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedItem.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You currently have {tomatoPoints.total} tomato points.
                After this purchase, you will have {tomatoPoints.total - selectedItem.price} points.
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPurchaseDialog(false)}>Cancel</Button>
          <Button onClick={handlePurchase} variant="contained">
            Purchase
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Templates Dialog */}
      <Dialog 
        open={templateDialog} 
        onClose={() => setTemplateDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Choose a Template</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {taskTemplates.map((template) => (
              <Card 
                key={template.id}
                sx={{ 
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": { transform: "translateY(-2px)", boxShadow: 2 }
                }}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    📋 {template.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {template.totalPomodoros} Pomodoros • {template.tasks.length} Tasks
                  </Typography>
                  <Typography variant="body2">
                    Tasks: {template.tasks.join(", ")}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTemplateDialog(false)}>Cancel</Button>
          {selectedTemplate && (
            <Button 
              onClick={() => handleUseTemplate(selectedTemplate)} 
              variant="contained"
            >
              Create Tasks
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}