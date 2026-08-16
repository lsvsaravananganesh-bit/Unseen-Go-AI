/* UnseenGo AI — Phase 2D auth-aware navigation */
(function(){
  function injectStyles(){
    if(document.getElementById('authNavStyles'))return;
    const st=document.createElement('style');
    st.id='authNavStyles';
    st.textContent=`
      /* Clean word-based navigation */
      .nav{display:flex!important;align-items:center;justify-content:space-between;gap:24px!important}
      .nav nav{
        display