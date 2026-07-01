'use client';

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, BookOpen, Save, X, Utensils, Star, MapPin } from 'lucide-react';
import { useAppState } from '@/services/appState';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Restaurant, MenuItem } from '@/types';

export default function OwnerRestaurants() {
  const { restaurants, addRestaurant, updateRestaurant, currentUser } = useAppState();

  // Owned restaurants
  const ownedRestaurants = restaurants.filter(r => r.ownerId === currentUser?.id || r.ownerId === 'usr-2');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedRest, setSelectedRest] = useState<Restaurant | null>(null);

  // Menu editor sub-state
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuName, setNewMenuName] = useState('');
  const [newMenuDesc, setNewMenuDesc] = useState('');
  const [newMenuPrice, setNewMenuPrice] = useState('15');
  const [newMenuCat, setNewMenuCat] = useState('Main Course');

  // Add Restaurant form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [location, setLocation] = useState('');
  const [priceRange, setPriceRange] = useState<'$$' | '$$$' | '$$$$'>('$$$');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openingHours, setOpeningHours] = useState('17:00 - 23:00');
  const [image, setImage] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const defaultImg = image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80';
    addRestaurant({
      name,
      description,
      cuisine,
      location,
      priceRange,
      address,
      phone,
      email,
      openingHours,
      image: defaultImg,
      featured: false,
      menu: []
    });
    setAddModalOpen(false);
    resetForm();
    alert('New restaurant registered successfully!');
  };

  const handleEditClick = (rest: Restaurant) => {
    setSelectedRest(rest);
    setName(rest.name);
    setDescription(rest.description);
    setCuisine(rest.cuisine);
    setLocation(rest.location);
    setPriceRange(rest.priceRange);
    setAddress(rest.address);
    setPhone(rest.phone);
    setEmail(rest.email);
    setOpeningHours(rest.openingHours);
    setImage(rest.image);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRest) return;
    
    const updated: Restaurant = {
      ...selectedRest,
      name,
      description,
      cuisine,
      location,
      priceRange,
      address,
      phone,
      email,
      openingHours,
      image
    };

    updateRestaurant(updated);
    setEditModalOpen(false);
    resetForm();
    alert('Restaurant configurations saved successfully.');
  };

  const handleMenuClick = (rest: Restaurant) => {
    setSelectedRest(rest);
    setMenuItems(rest.menu || []);
    setMenuModalOpen(true);
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName || !selectedRest) return;

    const newItem: MenuItem = {
      id: `m-${Date.now()}`,
      name: newMenuName,
      description: newMenuDesc,
      price: parseFloat(newMenuPrice) || 10,
      category: newMenuCat
    };

    const updatedMenu = [...menuItems, newItem];
    setMenuItems(updatedMenu);
    
    // Save to global appState
    updateRestaurant({
      ...selectedRest,
      menu: updatedMenu
    });

    // Reset inputs
    setNewMenuName('');
    setNewMenuDesc('');
    setNewMenuPrice('15');
    alert('Menu item added!');
  };

  const handleDeleteMenuItem = (itemId: string) => {
    if (!selectedRest) return;
    const updatedMenu = menuItems.filter(item => item.id !== itemId);
    setMenuItems(updatedMenu);
    
    updateRestaurant({
      ...selectedRest,
      menu: updatedMenu
    });
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setCuisine('');
    setLocation('');
    setPriceRange('$$$');
    setAddress('');
    setPhone('');
    setEmail('');
    setOpeningHours('17:00 - 23:00');
    setImage('');
    setSelectedRest(null);
  };

  return (
    <DashboardLayout role="owner">
      <div className="space-y-8 font-sans text-neutral-200">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight leading-none mb-1.5">
              Restaurant Management
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">
              Register venues, define locations, and configure menu listings.
            </p>
          </div>
          <Button variant="primary" size="sm" onClick={() => { resetForm(); setAddModalOpen(true); }} className="h-fit">
            <Plus size={16} className="mr-1.5" />
            Add Restaurant
          </Button>
        </div>

        {/* Owned Restaurants List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ownedRestaurants.map(rest => (
            <Card key={rest.id} variant="glass" className="flex flex-col h-full group">
              <div className="relative aspect-[2/1] overflow-hidden bg-neutral-950">
                <img src={rest.image} alt={rest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className="px-2.5 py-0.5 bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 text-amber-400 font-semibold rounded text-[10px] uppercase">
                    {rest.cuisine}
                  </span>
                </div>
                <div className="absolute top-4 right-4 flex items-center gap-1 bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded text-xs shadow-lg">
                  <Star size={11} fill="currentColor" />
                  <span>{rest.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight mb-1">{rest.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-neutral-500">
                    <MapPin size={11} />
                    <span>{rest.location}</span>
                  </div>
                  <p className="text-xs text-neutral-400 font-light mt-3 leading-relaxed truncate-2-lines line-clamp-2">
                    {rest.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-900/60">
                  <span className="text-[10px] text-neutral-500 font-semibold">{rest.menu.length} active menu items</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleMenuClick(rest)}
                      className="p-2 bg-neutral-950 border border-neutral-850 hover:border-amber-500/40 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Manage Menu"
                    >
                      <Utensils size={14} />
                    </button>
                    <button
                      onClick={() => handleEditClick(rest)}
                      className="p-2 bg-neutral-950 border border-neutral-850 hover:border-amber-500/40 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                      title="Edit Details"
                    >
                      <Plus size={14} className="rotate-45" /> {/* Just custom icon */}
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Add Restaurant Modal */}
        <Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)} title="Register Restaurant">
          <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
            <div className="space-y-1.5 text-left">
              <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[10px] mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Cuisine Type" value={cuisine} onChange={e => setCuisine(e.target.value)} required placeholder="e.g. Steakhouse" />
              <Input label="Location Summary" value={location} onChange={e => setLocation(e.target.value)} required placeholder="e.g. Brooklyn, NY" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Street Address" value={address} onChange={e => setAddress(e.target.value)} required />
              <Input label="Opening Hours" value={openingHours} onChange={e => setOpeningHours(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contact Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
              <Input label="Contact Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">Price Tier</label>
                <select
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value as any)}
                  className="bg-neutral-900 border border-neutral-800 text-white p-2 py-2.5 rounded-lg outline-none"
                >
                  <option value="$$">$$ (Casual)</option>
                  <option value="$$$">$$$ (Premium)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>
              <Input label="Cover Image URL" placeholder="https://..." value={image} onChange={e => setImage(e.target.value)} />
            </div>
            <Button type="submit" variant="primary" fullWidth className="py-2.5">Register Venue</Button>
          </form>
        </Modal>

        {/* Edit Restaurant Modal */}
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} title="Edit Restaurant Settings">
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <Input label="Name" value={name} onChange={e => setName(e.target.value)} required />
            <div className="space-y-1.5 text-left">
              <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[10px] mb-1">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg px-3 py-2 outline-none focus:border-amber-500 transition-colors"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Cuisine Type" value={cuisine} onChange={e => setCuisine(e.target.value)} required />
              <Input label="Location Summary" value={location} onChange={e => setLocation(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Street Address" value={address} onChange={e => setAddress(e.target.value)} required />
              <Input label="Opening Hours" value={openingHours} onChange={e => setOpeningHours(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Contact Phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
              <Input label="Contact Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">Price Tier</label>
                <select
                  value={priceRange}
                  onChange={e => setPriceRange(e.target.value as any)}
                  className="bg-neutral-900 border border-neutral-800 text-white p-2 py-2.5 rounded-lg outline-none"
                >
                  <option value="$$">$$ (Casual)</option>
                  <option value="$$$">$$$ (Premium)</option>
                  <option value="$$$$">$$$$ (Luxury)</option>
                </select>
              </div>
              <Input label="Cover Image URL" value={image} onChange={e => setImage(e.target.value)} />
            </div>
            <Button type="submit" variant="primary" fullWidth className="py-2.5">Save Configuration</Button>
          </form>
        </Modal>

        {/* Menu Management Modal */}
        <Modal isOpen={menuModalOpen} onClose={() => setMenuModalOpen(false)} title={`Menu: ${selectedRest?.name}`} maxWidth="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs font-sans">
            {/* Add menu item form */}
            <form onSubmit={handleAddMenuItem} className="space-y-4 pr-0 md:pr-4 border-r-0 md:border-r border-neutral-900">
              <h4 className="text-sm font-bold text-white border-b border-neutral-900 pb-2">Add Dish Listing</h4>
              <Input label="Dish Title" placeholder="e.g. Filet Mignon" value={newMenuName} onChange={e => setNewMenuName(e.target.value)} required />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Price ($)" type="number" value={newMenuPrice} onChange={e => setNewMenuPrice(e.target.value)} required />
                <div className="flex flex-col">
                  <label className="text-neutral-400 uppercase font-bold tracking-wider mb-2 text-[10px]">Course Category</label>
                  <select
                    value={newMenuCat}
                    onChange={e => setNewMenuCat(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 text-white p-2 py-2.5 rounded-lg outline-none"
                  >
                    <option value="Appetizers">Appetizers</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Desserts">Desserts</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5 text-left">
                <label className="block text-neutral-400 uppercase tracking-wider font-semibold text-[10px] mb-1">Recipe / Description</label>
                <textarea
                  value={newMenuDesc}
                  onChange={e => setNewMenuDesc(e.target.value)}
                  placeholder="Ingredients and serving details..."
                  rows={3}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg p-2.5 outline-none focus:border-amber-500 transition-colors"
                />
              </div>
              <Button type="submit" variant="primary" fullWidth className="py-2">Add to Menu</Button>
            </form>

            {/* Existing Menu Items list */}
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              <h4 className="text-sm font-bold text-white border-b border-neutral-900 pb-2">Active Menu Listings</h4>
              {menuItems.length === 0 ? (
                <div className="py-10 text-center text-neutral-500 font-medium">No dishes listed yet. Add items using the left form.</div>
              ) : (
                <div className="space-y-3">
                  {menuItems.map(item => (
                    <div key={item.id} className="p-3 bg-neutral-950 border border-neutral-900 rounded-xl flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{item.name}</span>
                          <span className="px-1.5 py-0.5 bg-neutral-900 text-amber-500/80 rounded border border-neutral-800 text-[8px] font-semibold uppercase tracking-wider">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-relaxed font-light">{item.description}</p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-bold text-neutral-300 font-mono text-xs">${item.price}</span>
                        <button
                          onClick={() => handleDeleteMenuItem(item.id)}
                          className="p-1 rounded bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/10 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
