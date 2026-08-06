sed -i 's/dispatch({ type: '\''NAVIGATE'\'', payload: '\''home'\'' })/dispatch({ type: '\''CHANGE_VIEW'\'', payload: '\''game'\'' })/g' components/VevoView.tsx
sed -i 's/bg-black min-h-full/bg-black h-full overflow-y-auto/g' components/VevoView.tsx
