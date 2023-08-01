//  분석 버튼!
const analysis = document.getElementById('analysis');
//  초기화 버튼
const white_btn = document.getElementById('white-btn');
//  채팅 버튼
const main_btn = document.getElementById('chat-start');

//  채팅 모달창
const modal = document.getElementById('modal');
const modal_close = document.getElementById('modal-close');

const context_box = document.getElementById('input-box-text');
const context_length = document.getElementById('context-length');

const result_box_list = document.getElementById('result-box-list');

const chat_list = document.getElementById('chat-list');
const chat_input = document.getElementById('chat-input');
const chat_text = document.getElementById('chat-text');

let len = 0


context_box.addEventListener('input', () => {
    len = context_box.value.length;
    context_length.textContent = len
})

white_btn.addEventListener('click', () => {
    location.reload()
})

analysis.addEventListener('click', () => {
    if (len >= 100 && len <= 4000) {
        analysis.style.display = 'none';
        main_btn.style.display = 'inline-block';
        context_box.setAttribute("readonly", "readonly");
        server(context_box.value)
    } else {
        alert('최소 100자 최대 4000자로 입력하세요.')
    }
})

main_btn.addEventListener('click', () => {
    modal.classList.add('active');
    const clonedBox = result_box_list.querySelector('li:first-child').textContent
    chat_list.innerHTML += `<li><span class="icon"></span><p class="interviewer">${clonedBox}</p></li>`;
})

modal_close.addEventListener('click', () => {
    modal.classList.remove('active');
})

chat_input.addEventListener('submit', event => {
    event.preventDefault();

    let text = chat_text.value;


    chat_text.value = '';
    chat_list.innerHTML += `<li class="interviewee"><p>${text}</p></li>`;
    chat_list.lastElementChild.scrollIntoView({ behavior: "smooth" })
    chat_text.setAttribute("readonly", true);
    server_chat(text)
    chat_text.removeAttribute("readonly");
})


async function server(context) {
    await fetch('http://127.0.0.1:8000/test', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "context": context
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(datas => {
            // 여기는 백 오면 수정

            datas.forEach(data => {
                console.log(data)
                //  대답이 면접관 텍스트로 들어가는 과정
                result_box_list.innerHTML += `<li>${data}</li>`;
            });
        })
}

async function server_chat(context) {
    context_box.setAttribute("readonly", "readonly");
    await fetch('http://127.0.0.1:8000/chat', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "context": context
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(datas => {
            // 여기는 백 오면 수정
            let data_list = '';
            datas.forEach(data => {
                console.log(data)

                //  대답이 면접관 텍스트로 들어가는 과정
                chat_list.innerHTML += `<li class="interviewer_li"><span class="icon"></span><p class="interviewer">${data}</p></li>`;
                chat_list.lastElementChild.scrollIntoView({ behavior: "smooth" })
                context_box.removeAttribute("readonly");
            });
        })
}