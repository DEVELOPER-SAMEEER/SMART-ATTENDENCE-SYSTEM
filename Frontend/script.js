const API_URL = "http://localhost:3000";

        function switchView(viewName) {
            document.getElementById('home-view').classList.add('hidden');
            document.getElementById('login-view').classList.add('hidden');
            document.getElementById('register-view').classList.add('hidden');
            document.getElementById('dashboard-view').classList.add('hidden');

            if (viewName === 'home') {
                document.getElementById('home-view').classList.remove('hidden');
            } else if (viewName === 'login') {
                document.getElementById('login-view').classList.remove('hidden');
            } else if (viewName === 'register') {
                document.getElementById('register-view').classList.remove('hidden');
            } else if (viewName === 'dashboard') {
                document.getElementById('dashboard-view').classList.remove('hidden');
                fetchAttendanceData();
            }
            window.scrollTo(0, 0);
        }

        function showMessage(elementId, text, isSuccess) {
            const box = document.getElementById(elementId);
            box.textContent = text;
            box.classList.remove('hidden', 'msg-success', 'msg-error');
            box.classList.add(isSuccess ? 'msg-success' : 'msg-error');
        }

        async function handleRegister(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            try {
                const check = await fetch(`${API_URL}/users?email=${email}`);
                const existing = await check.json();

                if (existing.length > 0) {
                    showMessage('reg-msg', 'User with this email already exists!', false);
                    return;
                }

                const res = await fetch(`${API_URL}/users`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                if (res.ok) {
                    showMessage('reg-msg', 'Registration successful! Redirecting...', true);
                    document.getElementById('reg-name').value = '';
                    document.getElementById('reg-email').value = '';
                    document.getElementById('reg-password').value = '';
                    setTimeout(() => switchView('login'), 1500);
                } else {
                    showMessage('reg-msg', 'Registration failed!', false);
                }
            } catch (err) {
                showMessage('reg-msg', 'Server connection error! Check json-server.', false);
            }
        }

                async function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const res = await fetch(`${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
                const users = await res.json();

                if (users.length > 0) {
                    showMessage('login-msg', 'Login success! Loading dashboard...', true);
                    document.getElementById('login-email').value = '';
                    document.getElementById('login-password').value = '';
                    setTimeout(() => switchView('dashboard'), 1000);
                } else {
                    showMessage('login-msg', 'Invalid email or password!', false);
                }
            } catch (err) {
                showMessage('login-msg', 'Server connection error! Check json-server.', false);
            }
        }

        async function fetchAttendanceData() {
            const tableBody = document.getElementById('attendance-table-body');
            tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">Loading attendance records...</td></tr>`;

            try {
                const res = await fetch(`${API_URL}/attendance`);
                const records = await res.json();

                tableBody.innerHTML = '';

                if (records.length === 0) {
                    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">No records available.</td></tr>`;
                    return;
                }

                records.forEach(record => {
                    const row = `
                        <tr>
                            <td><b>${record.roll || record.rollNo || '-'}</b></td>
                            <td>${record.name || 'Unknown'}</td>
                            <td>${record.time || record.timestamp || '-'}</td>
                            <td><span class="badge-present">${record.status || 'Present'}</span></td>
                        </tr>
                    `;
                    tableBody.innerHTML += row;
                });
            } catch (err) {
                tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px; color: red;">Failed to fetch data from json-server.</td></tr>`;
            }
        }

        function handleLogout() {
            document.getElementById('login-email').value = '';
            document.getElementById('login-password').value = '';
            switchView('home');
        }
        