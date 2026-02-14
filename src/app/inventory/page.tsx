'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { useInventoryStore } from '@/features/inventory/store';
import { 
  Package, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Activity,
  Users,
  User,
  Phone
} from 'lucide-react';
import { StockAdjustmentModal } from '@/features/inventory/components/StockAdjustmentModal';
import { Ingredient } from '@/features/inventory/types';
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/useCategories';
import {
  useActivateMenuItem,
  useCreateMenuItem,
  useDeactivateMenuItem,
  useDeleteMenuItem,
  useMenuItems,
  useUpdateMenuItem,
  useUpdateMenuItemStatus,
  useUploadMenuItemImage,
} from '@/hooks/useMenuItems';
import { ItemType, MenuItemCreate, MenuItemResponse, MenuItemUpdate } from '@/types/menu-item';
import { MenuCategoryResponse } from '@/types/category';

export default function InventoryPage() {
  const { ingredients, setIngredients, suppliers, setSuppliers, updateStock } = useInventoryStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'overview' | 'suppliers' | 'menu'>('overview');

  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryId, setMenuCategoryId] = useState<string>('all');
  const [menuItemType, setMenuItemType] = useState<ItemType | 'all'>('all');
  const [menuIsActive, setMenuIsActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItemResponse | null>(null);
  const [menuForm, setMenuForm] = useState<{
    name: string;
    description: string;
    price: string;
    category_id: string;
    item_type: ItemType;
    preparation_time: string;
    image_url: string;
  }>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    item_type: 'food',
    preparation_time: '',
    image_url: '',
  });
  const [imageUrlDraft, setImageUrlDraft] = useState('');
  const [imageDataUrlDraft, setImageDataUrlDraft] = useState<string>('');
  const [isReadingImage, setIsReadingImage] = useState(false);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategoryResponse | null>(null);
  const [categoryForm, setCategoryForm] = useState<{ name: string; description: string }>({
    name: '',
    description: '',
  });
  
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);

  const { data: categoriesRes } = useCategories({ page: 1, paging: 100 });
  const categoriesList = categoriesRes?.data ?? [];

  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const { data: menuItemsRes, isLoading: isMenuLoading } = useMenuItems({
    page: 1,
    paging: 100,
    search: menuSearch || undefined,
    category_id: menuCategoryId === 'all' ? undefined : menuCategoryId,
    item_type: menuItemType === 'all' ? undefined : menuItemType,
    is_active:
      menuIsActive === 'all' ? undefined : menuIsActive === 'active' ? true : false,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  const menuItems = menuItemsRes?.data ?? [];

  const createMenuItem = useCreateMenuItem();
  const updateMenuItem = useUpdateMenuItem();
  const activateMenuItem = useActivateMenuItem();
  const deactivateMenuItem = useDeactivateMenuItem();
  const deleteMenuItem = useDeleteMenuItem();
  const updateMenuItemStatus = useUpdateMenuItemStatus();
  const uploadMenuItemImage = useUploadMenuItemImage();

  const handleAdjust = (ingredient: Ingredient) => {
    setSelectedIngredient(ingredient);
    setIsAdjustmentOpen(true);
  };

  const onConfirmAdjustment = (id: string, quantity: number, type: 'in' | 'out' | 'adjustment', reason: string) => {
    updateStock(id, quantity, type, reason, 'Admin');
  };

  const openCreateMenuModal = () => {
    const defaultCategoryId = categoriesList[0]?.id ?? '';
    setEditingMenuItem(null);
    setMenuForm({
      name: '',
      description: '',
      price: '',
      category_id: defaultCategoryId,
      item_type: 'food',
      preparation_time: '',
      image_url: '',
    });
    setImageUrlDraft('');
    setImageDataUrlDraft('');
    setIsMenuModalOpen(true);
  };

  const openCreateCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', description: '' });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: MenuCategoryResponse) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name, description: cat.description ?? '' });
    setIsCategoryModalOpen(true);
  };

  const onSubmitCategory = async () => {
    if (!categoryForm.name.trim()) return;
    if (editingCategory) {
      await updateCategory.mutateAsync({
        id: editingCategory.id,
        data: {
          name: categoryForm.name.trim(),
          description: categoryForm.description.trim() ? categoryForm.description.trim() : undefined,
        },
      });
    } else {
      await createCategory.mutateAsync({
        name: categoryForm.name.trim(),
        description: categoryForm.description.trim() ? categoryForm.description.trim() : undefined,
      });
    }
    setIsCategoryModalOpen(false);
  };

  const onDeleteCategory = async (cat: MenuCategoryResponse) => {
    const ok = window.confirm(`Delete category "${cat.name}"?`);
    if (!ok) return;
    await deleteCategory.mutateAsync(cat.id);
    if (menuCategoryId === cat.id) setMenuCategoryId('all');
  };

  const openEditMenuModal = (item: MenuItemResponse) => {
    setEditingMenuItem(item);
    setMenuForm({
      name: item.name,
      description: item.description ?? '',
      price: String(item.price),
      category_id: item.category_id,
      item_type: item.item_type,
      preparation_time: item.preparation_time == null ? '' : String(item.preparation_time),
      image_url: item.image_url ?? '',
    });
    setImageUrlDraft(item.image_url ?? '');
    setImageDataUrlDraft('');
    setIsMenuModalOpen(true);
  };

  const readAsDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

  const onPickImageFile = async (file: File | null) => {
    if (!file) return;
    setIsReadingImage(true);
    try {
      const dataUrl = await readAsDataUrl(file);
      setImageDataUrlDraft(dataUrl);
      setMenuForm((p) => ({ ...p, image_url: dataUrl }));
      setImageUrlDraft(dataUrl);
    } finally {
      setIsReadingImage(false);
    }
  };

  const onSubmitMenuItem = async () => {
    const price = Number(menuForm.price);
    if (!menuForm.name.trim() || !menuForm.category_id || Number.isNaN(price)) return;

    const base: Omit<MenuItemCreate, 'price'> & { price: number } = {
      name: menuForm.name.trim(),
      description: menuForm.description.trim() ? menuForm.description.trim() : undefined,
      price,
      category_id: menuForm.category_id,
      item_type: menuForm.item_type,
      preparation_time: menuForm.preparation_time.trim()
        ? Number(menuForm.preparation_time)
        : undefined,
      image_url: menuForm.image_url.trim() ? menuForm.image_url.trim() : undefined,
    };

    if (editingMenuItem) {
      const payload: MenuItemUpdate = {
        ...base,
      };
      await updateMenuItem.mutateAsync({ id: editingMenuItem.id, data: payload });
    } else {
      await createMenuItem.mutateAsync(base);
    }

    setIsMenuModalOpen(false);
  };

  const onToggleActive = async (item: MenuItemResponse) => {
    if (item.is_active) {
      await deactivateMenuItem.mutateAsync(item.id);
    } else {
      await activateMenuItem.mutateAsync(item.id);
    }
  };

  const onSetStatus = async (item: MenuItemResponse, isActive: boolean) => {
    await updateMenuItemStatus.mutateAsync({ id: item.id, data: { is_active: isActive } });
  };

  const onDeleteMenu = async (item: MenuItemResponse) => {
    const ok = window.confirm(`Delete menu item "${item.name}"?`);
    if (!ok) return;
    await deleteMenuItem.mutateAsync(item.id);
  };

  const onUploadImageUrl = async () => {
    if (!editingMenuItem) return;
    const url = imageDataUrlDraft.trim() || imageUrlDraft.trim();
    if (!url) return;
    await uploadMenuItemImage.mutateAsync({ id: editingMenuItem.id, data: { image_url: url } });
  };

  const stats = [
    { label: 'Total Items', value: ingredients.length, icon: <Package size={20} />, color: 'blue' },
    { label: 'Low Stock', value: ingredients.filter(i => i.status === 'low_stock').length, icon: <AlertTriangle size={20} />, color: 'orange' },
    { label: 'Out of Stock', value: ingredients.filter(i => i.status === 'out_of_stock').length, icon: <AlertTriangle size={20} />, color: 'red' },
    { label: 'Monthly Inbound', value: '12.4M ₭', icon: <ArrowUpRight size={20} />, color: 'emerald' },
  ];

  const categories = ['All', ...Array.from(new Set(ingredients.map(i => i.category)))];

  const filteredItems = ingredients.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardLayout>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Inventory Management</h1>
            <p className="text-slate-500 font-medium">Monitor stock levels, suppliers, and procurement</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#12141a] border border-white/5 px-6 py-4 rounded-2xl text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2">
              <Activity size={20} className="text-orange-500" />
              Stock Reports
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2">
              <Plus size={20} />
              Add New Item
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 bg-[#12141a] p-1.5 rounded-2xl border border-white/5 w-fit mb-10">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'overview' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            Inventory Overview
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'menu' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            Menu Items
          </button>
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'suppliers' ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
            }`}
          >
            Supplier Directory
          </button>
        </div>

        {activeTab === 'overview' ? (
          <>
            {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-[#12141a] border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-${stat.color}-500/10 transition-all`} />
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{stat.label}</p>
                  <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.color}-500/10 text-${stat.color}-500 border border-${stat.color}-500/20 shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-3 rounded-2xl font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-white text-black border-white shadow-xl shadow-white/10'
                      : 'bg-black/20 text-slate-400 border-white/5 hover:border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                />
              </div>
              <button className="bg-black/40 border border-white/5 p-3.5 rounded-2xl text-slate-400 hover:text-white transition-all">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-6 group hover:border-orange-500/30 transition-all relative overflow-hidden">
               {/* Status Indicator */}
               <div className={`absolute top-0 right-0 w-24 h-24 blur-[80px] -mr-10 -mt-10 opacity-30 ${
                 item.status === 'in_stock' ? 'bg-emerald-500' : 
                 item.status === 'low_stock' ? 'bg-orange-500' : 'bg-red-500'
               }`} />

               <div className="flex justify-between items-start mb-6 relative z-10">
                 <div>
                   <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block w-fit">
                     {item.category}
                   </span>
                   <h4 className="text-xl font-black text-white">{item.name}</h4>
                 </div>
                 <button className="text-slate-600 hover:text-white transition-colors">
                   <MoreVertical size={20} />
                 </button>
               </div>

               <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                 <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Current Stock</p>
                   <p className={`text-xl font-black ${
                     item.status === 'in_stock' ? 'text-white' : 
                     item.status === 'low_stock' ? 'text-orange-500' : 'text-red-500'
                   }`}>
                     {item.currentStock.toLocaleString()} <span className="text-xs font-medium text-slate-500 tracking-normal">{item.unit}</span>
                   </p>
                 </div>
                 <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Unit Price</p>
                   <p className="text-xl font-black text-white">{item.pricePerUnit.toLocaleString()} ₭</p>
                 </div>
               </div>

               <div className="flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${
                     item.status === 'in_stock' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 
                     item.status === 'low_stock' ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 
                     'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                   }`} />
                   <span className={`text-[10px] font-black uppercase tracking-widest ${
                     item.status === 'in_stock' ? 'text-emerald-500' : 
                     item.status === 'low_stock' ? 'text-orange-500' : 'text-red-500'
                   }`}>
                     {item.status.replace('_', ' ')}
                   </span>
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => handleAdjust(item)}
                     className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                   >
                     <Plus size={18} />
                   </button>
                   <button 
                     onClick={() => handleAdjust(item)}
                     className="flex items-center gap-2 px-4 py-2 bg-white/5 text-white font-bold rounded-xl text-xs hover:bg-white/10 transition-all border border-white/5"
                   >
                     Adjust
                   </button>
                 </div>
               </div>
            </div>
          ))}
            </div>
          </>
        ) : activeTab === 'menu' ? (
          <>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
              <div>
                <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Menu Items</h2>
                <p className="text-slate-500 font-medium">Create and manage items shown in public menu</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={openCreateCategoryModal}
                  className="bg-[#12141a] border border-white/5 px-6 py-4 rounded-2xl text-white font-bold hover:bg-white/5 transition-all flex items-center gap-2"
                >
                  <Plus size={20} className="text-indigo-400" />
                  Add Category
                </button>
                <button
                  onClick={openCreateMenuModal}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add New Menu
                </button>
              </div>
            </div>

            <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-8 mb-10">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-black text-white">Categories</h3>
                  <p className="text-slate-500 text-sm font-medium">Used for filtering menu items</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {categoriesList.map((cat) => (
                  <div
                    key={cat.id}
                    className="bg-black/20 border border-white/5 rounded-[2rem] p-6 hover:border-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-2 h-2 rounded-full ${cat.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                          <h4 className="text-white font-black truncate">{cat.name}</h4>
                        </div>
                        <p className="text-slate-500 text-xs font-medium truncate">{cat.description ?? ''}</p>
                      </div>
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="text-slate-600 hover:text-white transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDeleteCategory(cat)}
                        className="flex-1 py-3 bg-black/20 hover:bg-red-500/20 text-slate-300 hover:text-red-500 font-bold rounded-2xl border border-white/5 transition-all active:scale-95"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#12141a] border border-white/5 rounded-[3rem] p-8 mb-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                  <div>
                    <select
                      value={menuCategoryId}
                      onChange={(e) => setMenuCategoryId(e.target.value)}
                      className="bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value="all">All categories</option>
                      {categoriesList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <select
                      value={menuItemType}
                      onChange={(e) => setMenuItemType(e.target.value as any)}
                      className="bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value="all">All types</option>
                      <option value="food">Food</option>
                      <option value="beverage">Beverage</option>
                    </select>
                  </div>

                  <div>
                    <select
                      value={menuIsActive}
                      onChange={(e) => setMenuIsActive(e.target.value as any)}
                      className="bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    >
                      <option value="all">All status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={menuSearch}
                      onChange={(e) => setMenuSearch(e.target.value)}
                      className="w-full bg-black/40 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
                    />
                  </div>
                  <button className="bg-black/40 border border-white/5 p-3.5 rounded-2xl text-slate-400 hover:text-white transition-all">
                    <Filter size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {isMenuLoading ? (
                <div className="text-slate-500">Loading...</div>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-6 group hover:border-orange-500/30 transition-all relative overflow-hidden"
                  >
                    <div className={`absolute top-0 right-0 w-24 h-24 blur-[80px] -mr-10 -mt-10 opacity-30 ${
                      item.is_active ? 'bg-emerald-500' : 'bg-red-500'
                    }`} />
                    <div className="flex justify-between items-start mb-6 relative z-10">
                      <div className="min-w-0">
                        <span className="px-3 py-1 bg-white/5 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 block w-fit">
                          {item.item_type}
                        </span>
                        <h4 className="text-xl font-black text-white truncate">{item.name}</h4>
                        <p className="text-slate-500 text-xs mt-1 truncate">{item.description ?? ''}</p>
                      </div>
                      <button
                        onClick={() => openEditMenuModal(item)}
                        className="text-slate-600 hover:text-white transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                      <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Price</p>
                        <p className="text-xl font-black text-white">{item.price.toLocaleString()} ₭</p>
                      </div>
                      <div className="bg-black/20 p-4 rounded-3xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Status</p>
                        <p className={`text-xl font-black ${item.is_active ? 'text-emerald-500' : 'text-red-500'}`}>
                          {item.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 relative z-10">
                      <button
                        onClick={() => openEditMenuModal(item)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all active:scale-95"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onToggleActive(item)}
                        className={`flex-1 py-3 font-bold rounded-2xl border transition-all active:scale-95 ${
                          item.is_active
                            ? 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500 hover:text-white'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white'
                        }`}
                      >
                        {item.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => onDeleteMenu(item)}
                        className="w-full py-3 bg-black/20 hover:bg-red-500/20 text-slate-300 hover:text-red-500 font-bold rounded-2xl border border-white/5 transition-all active:scale-95"
                      >
                        Delete
                      </button>
                      <div className="w-full flex gap-2">
                        <button
                          onClick={() => onSetStatus(item, true)}
                          className="flex-1 py-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all active:scale-95"
                        >
                          Set Active
                        </button>
                        <button
                          onClick={() => onSetStatus(item, false)}
                          className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                        >
                          Set Inactive
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {isMenuModalOpen && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
                <div
                  className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                  onClick={() => setIsMenuModalOpen(false)}
                />
                <div className="bg-[#12141a] w-full max-w-2xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-black text-white">
                      {editingMenuItem ? 'Edit Menu Item' : 'Add New Menu'}
                    </h3>
                    <button
                      onClick={() => setIsMenuModalOpen(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Name</label>
                      <input
                        value={menuForm.name}
                        onChange={(e) => setMenuForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="Fried rice"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Price</label>
                      <input
                        value={menuForm.price}
                        onChange={(e) => setMenuForm((p) => ({ ...p, price: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="25000"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Category</label>
                      <select
                        value={menuForm.category_id}
                        onChange={(e) => setMenuForm((p) => ({ ...p, category_id: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      >
                        {categoriesList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Type</label>
                      <select
                        value={menuForm.item_type}
                        onChange={(e) => setMenuForm((p) => ({ ...p, item_type: e.target.value as ItemType }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                      >
                        <option value="food">Food</option>
                        <option value="beverage">Beverage</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                      <input
                        value={menuForm.description}
                        onChange={(e) => setMenuForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Preparation time (min)</label>
                      <input
                        value={menuForm.preparation_time}
                        onChange={(e) => setMenuForm((p) => ({ ...p, preparation_time: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Image URL</label>
                      <input
                        value={menuForm.image_url}
                        onChange={(e) => setMenuForm((p) => ({ ...p, image_url: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  <div className="mt-6 bg-black/20 border border-white/5 rounded-[2rem] p-6">
                    <div className="flex flex-col md:flex-row gap-4 md:items-end">
                      <div className="flex-1 w-full">
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Pick image file</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => onPickImageFile(e.target.files?.[0] ?? null)}
                          className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                      </div>

                      <div className="w-full md:w-40">
                        <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Preview</div>
                        <div className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl overflow-hidden flex items-center justify-center">
                          {(imageDataUrlDraft || menuForm.image_url) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={imageDataUrlDraft || menuForm.image_url}
                              alt="preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-slate-600 text-xs font-bold">No image</div>
                          )}
                        </div>
                      </div>
                    </div>
                    {isReadingImage && <div className="text-slate-500 text-xs font-medium mt-3">Reading image...</div>}
                  </div>

                  {editingMenuItem && (
                    <div className="mt-6 bg-black/20 border border-white/5 rounded-[2rem] p-6">
                      <div className="flex flex-col md:flex-row gap-3 items-start md:items-end">
                        <div className="flex-1 w-full">
                          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Upload image URL</label>
                          <input
                            value={imageUrlDraft}
                            onChange={(e) => setImageUrlDraft(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            placeholder="https://..."
                          />
                        </div>
                        <button
                          onClick={onUploadImageUrl}
                          disabled={uploadMenuItemImage.isPending || (!imageUrlDraft.trim() && !imageDataUrlDraft.trim())}
                          className="w-full md:w-auto px-6 py-3.5 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-2xl font-black transition-all"
                        >
                          Save Image
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 flex flex-col md:flex-row gap-3">
                    <button
                      onClick={onSubmitMenuItem}
                      disabled={createMenuItem.isPending || updateMenuItem.isPending}
                      className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsMenuModalOpen(false)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/5 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isCategoryModalOpen && (
              <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
                <div
                  className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                  onClick={() => setIsCategoryModalOpen(false)}
                />
                <div className="bg-[#12141a] w-full max-w-xl rounded-[3rem] border border-white/5 shadow-2xl relative overflow-hidden p-8">
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-black text-white">
                      {editingCategory ? 'Edit Category' : 'Add Category'}
                    </h3>
                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="text-slate-400 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Name</label>
                      <input
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm((p) => ({ ...p, name: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="Main dishes"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description</label>
                      <input
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm((p) => ({ ...p, description: e.target.value }))}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        placeholder="Optional"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col md:flex-row gap-3">
                    <button
                      onClick={onSubmitCategory}
                      disabled={createCategory.isPending || updateCategory.isPending}
                      className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-orange-500/20 transition-all active:scale-95"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsCategoryModalOpen(false)}
                      className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white font-black rounded-2xl border border-white/5 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {suppliers.map((supplier) => (
              <div key={supplier.id} className="bg-[#12141a] border border-white/5 rounded-[2.5rem] p-8 group hover:border-orange-500/30 transition-all relative overflow-hidden">
                <div className="bg-orange-500/5 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 shadow-lg group-hover:scale-110 transition-transform">
                    <Users size={24} />
                  </div>
                  <button className="text-slate-600 hover:text-white transition-colors">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1 block">{supplier.category}</span>
                  <h4 className="text-2xl font-black text-white mb-6">{supplier.name}</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Contact</p>
                        <p className="text-sm font-bold text-white">{supplier.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-black/20 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Phone</p>
                        <p className="text-sm font-bold text-white">{supplier.phone}</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/5 transition-all active:scale-95">
                    View Purchase History
                  </button>
                </div>
              </div>
            ))}
            <button className="bg-black/20 border-2 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-500 hover:border-orange-500/50 hover:text-orange-500 transition-all group">
               <div className="w-16 h-16 rounded-full border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Plus size={32} />
               </div>
               <span className="font-black uppercase tracking-widest text-sm">Add New Supplier</span>
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
