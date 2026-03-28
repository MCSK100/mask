import { useState } from "react"

export default function Controls({sendMessage}){

const [text,setText] = useState("")

function handleSend(){

if(!text) return

sendMessage(text)
setText("")

}

return(

<div className="p-4 flex gap-3">

<input
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="Type message..."
className="flex-1 bg-slate-900 p-3 rounded-lg outline-none"
/>

<button
onClick={handleSend}
className="bg-purple-600 px-6 rounded-lg hover:bg-purple-500"
>
Send
</button>

</div>

)

}