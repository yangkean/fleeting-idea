// compute element tags type of a page 

function getNode(target, elementArray) {
  const child = target.childNodes

  for(let i = 0; i < child.length; i++) {
    if(child[i].nodeType === 1) { // detect element node
      if(!(child[i].nodeName in elementArray)) {
        elementArray[child[i].nodeName] = 1
      } else {
        elementArray[child[i].nodeName]++
      }

      console.log(`Begin an element: ${child[i].nodeName}`)

      if(child[i].childNodes.length > 0) getNode(child[i], elementArray)

      console.log(`End an element: ${child[i].nodeName}`)
    }
  }
}

function classifyTag(target) {
  const elementArray = {}

  getNode(target, elementArray)

  for(let element in elementArray) {
    console.log(`There are ${elementArray[element]} ${element} tag(s) in this page under ${target.nodeName} tag`)
  }
}

classifyTag(document)
