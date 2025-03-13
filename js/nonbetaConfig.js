

export async function configNonBeta() {
    servoNames = [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"]];
    addBlocks();
    await loadScript("js/nonbeta_blocks.js?version=1.1.0");
  }

  async function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        console.log(`Loaded script: ${src}`);
        resolve(script);
      };
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${src}`));
      };
      document.head.appendChild(script);
    });
  }
  
  //add blocks
function addBlocks(){
    // Parse the JSON string into an object.
    //console.log(typeof blocklyToolbox); // should log "string" if it needs parsing
    let toolboxObj = blocklyToolbox;
    
    // Define the new block you want to add.
    let newBlock = {
        "kind": "BLOCK",
        "type": "xrp_color_LED" 
    };
    
    // Choose the category where you want to add the block.
    const targetCategoryName = "Control Board";
    
    // Find that category in the toolbox.
    for (let i = 0; i < toolboxObj.contents.length; i++) {
        let category = toolboxObj.contents[i];
        if (category.kind === "CATEGORY" && category.name === targetCategoryName) {
        // Ensure the category has a contents array.
        if (!category.contents) {
            category.contents = [];
        }
        // Add the new block to the category.
        category.contents.push(newBlock);
        break;
        }
    }
    blocklyToolbox = toolboxObj;
}
